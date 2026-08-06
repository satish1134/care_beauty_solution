import { emailService } from './emailService';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  source: string;
}

export interface AbandonedCartJob {
  id: string;
  userEmail: string;
  userName: string;
  cartItems: Array<{ productName: string; quantity: number; price: number }>;
  cartTotal: number;
  lastActiveAt: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED' | 'RECOVERED';
  enqueuedAt: string;
  processedAt?: string;
  recoveryEmailSent: boolean;
  messageId?: string;
}

// In-memory BullMQ / Redis Job Queue Abstraction Store
const newsletterSubscribersStore: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'ananya.sharma@example.com',
    name: 'Ananya Sharma',
    subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'SUBSCRIBED',
    source: 'Footer Signup',
  },
  {
    id: 'sub-2',
    email: 'priya.patel@example.com',
    name: 'Priya Patel',
    subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'SUBSCRIBED',
    source: 'Popup Modal',
  },
];

const abandonedCartJobsQueue: AbandonedCartJob[] = [];

export class MarketingService {
  // 1. Newsletter Subscription
  static async subscribeNewsletter(email: string, name?: string, source: string = 'Website Footer'): Promise<{
    success: boolean;
    subscriber: NewsletterSubscriber;
    welcomeEmailSent: boolean;
    messageId?: string;
    message: string;
  }> {
    const cleanEmail = email.toLowerCase().trim();
    const existing = newsletterSubscribersStore.find((s) => s.email === cleanEmail);

    if (existing) {
      existing.status = 'SUBSCRIBED';
      return {
        success: true,
        subscriber: existing,
        welcomeEmailSent: false,
        message: 'Email is already subscribed to Care Beauty Solution newsletter.',
      };
    }

    const subscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      subscribedAt: new Date().toISOString(),
      status: 'SUBSCRIBED',
      source,
    };

    newsletterSubscribersStore.unshift(subscriber);

    // Send Welcome Email via Email Abstraction Layer
    const welcomeResult = await emailService.sendEmail({
      to: cleanEmail,
      subject: 'Welcome to Care Beauty Solution! Here is your ₹100 Off Voucher 🎁',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #022c22; background-color: #f0fdf4;">
          <h2 style="color: #059669;">Welcome to Clinical Skincare, ${subscriber.name}!</h2>
          <p>Thank you for joining Care Beauty Solution community.</p>
          <p>Use code <strong style="color: #059669; font-size: 18px;">WELCOME100</strong> on your first order of ₹699 or more.</p>
          <p><a href="https://carebeautysolution.com/products" style="display:inline-block; padding: 10px 20px; background-color: #059669; color: #fff; text-decoration: none; border-radius: 8px;">Shop Derm Formulations</a></p>
        </div>
      `,
    });

    return {
      success: true,
      subscriber,
      welcomeEmailSent: welcomeResult.success,
      messageId: welcomeResult.messageId,
      message: 'Successfully subscribed! Welcome email sent.',
    };
  }

  // Get all active newsletter subscribers
  static getSubscribers(): NewsletterSubscriber[] {
    return newsletterSubscribersStore;
  }

  // 2. Dispatch Broadcast Email Campaign to Subscribers
  static async dispatchNewsletterCampaign(campaignTitle: string, discountCode: string, bodyText: string): Promise<{
    success: boolean;
    recipientsCount: number;
    dispatchedEmails: Array<{ email: string; messageId: string }>;
  }> {
    const activeSubscribers = newsletterSubscribersStore.filter((s) => s.status === 'SUBSCRIBED');
    const dispatchedEmails: Array<{ email: string; messageId: string }> = [];

    for (const sub of activeSubscribers) {
      const emailResult = await emailService.sendEmail({
        to: sub.email,
        subject: `🔥 ${campaignTitle} — Exclusive Offer inside!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #022c22; background-color: #f0fdf4;">
            <h2 style="color: #059669;">${campaignTitle}</h2>
            <p>Hi ${sub.name},</p>
            <p>${bodyText}</p>
            ${discountCode ? `<p>Use code <strong style="color: #059669;">${discountCode}</strong> at checkout!</p>` : ''}
            <p><a href="https://carebeautysolution.com" style="display:inline-block; padding: 10px 20px; background-color: #059669; color: #fff; text-decoration: none; border-radius: 8px;">Explore Products</a></p>
          </div>
        `,
      });

      if (emailResult.success && emailResult.messageId) {
        dispatchedEmails.push({ email: sub.email, messageId: emailResult.messageId });
      }
    }

    return {
      success: true,
      recipientsCount: dispatchedEmails.length,
      dispatchedEmails,
    };
  }

  // 3. BullMQ / Redis Abandoned Cart Job Processor
  static async triggerAbandonedCartCronJob(inactivityThresholdHours: number = 2): Promise<{
    success: boolean;
    evaluatedCartsCount: number;
    enqueuedJobs: AbandonedCartJob[];
    emailsSentCount: number;
  }> {
    // Simulated Carts Store with inactivity
    const simulatedInactiveCarts = [
      {
        userEmail: 'rohit.verma@example.com',
        userName: 'Rohit Verma',
        cartItems: [{ productName: 'Ceramide Barrier Repair Cream (50ml)', quantity: 1, price: 599 }],
        cartTotal: 599,
        lastActiveAt: new Date(Date.now() - (inactivityThresholdHours + 1) * 3600000).toISOString(),
      },
      {
        userEmail: 'megha.gupta@example.com',
        userName: 'Megha Gupta',
        cartItems: [
          { productName: '10% Niacinamide Glow Serum (30ml)', quantity: 1, price: 699 },
          { productName: 'Gentle Hydrating Cleanser (150ml)', quantity: 1, price: 399 },
        ],
        cartTotal: 1098,
        lastActiveAt: new Date(Date.now() - (inactivityThresholdHours + 3) * 3600000).toISOString(),
      },
    ];

    const enqueuedJobs: AbandonedCartJob[] = [];
    let emailsSentCount = 0;

    for (const cart of simulatedInactiveCarts) {
      const jobId = `job_bullmq_cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Send Recovery Email via Email Abstraction Layer
      const emailResult = await emailService.sendEmail({
        to: cart.userEmail,
        subject: `Did you forget something, ${cart.userName}? Complete your order with 10% OFF 🛒`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #022c22; background-color: #f0fdf4;">
            <h2 style="color: #059669;">Your Clinical Skincare Items are Saved!</h2>
            <p>Hi ${cart.userName}, you left items in your Care Beauty Solution cart.</p>
            <ul>
              ${cart.cartItems.map((i) => `<li><strong>${i.productName}</strong> x${i.quantity} — ₹${i.price}</li>`).join('')}
            </ul>
            <p>Total: <strong>₹${cart.cartTotal}</strong></p>
            <p>Complete your purchase in 1-click and get 10% OFF with code <strong style="color: #059669;">RECOVER10</strong>:</p>
            <p><a href="https://carebeautysolution.com/checkout?recover=${jobId}" style="display:inline-block; padding: 12px 24px; background-color: #059669; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Return to Checkout</a></p>
          </div>
        `,
      });

      const job: AbandonedCartJob = {
        id: jobId,
        userEmail: cart.userEmail,
        userName: cart.userName,
        cartItems: cart.cartItems,
        cartTotal: cart.cartTotal,
        lastActiveAt: cart.lastActiveAt,
        status: emailResult.success ? 'PROCESSED' : 'FAILED',
        enqueuedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        recoveryEmailSent: emailResult.success,
        messageId: emailResult.messageId,
      };

      abandonedCartJobsQueue.unshift(job);
      enqueuedJobs.push(job);
      if (emailResult.success) emailsSentCount++;
    }

    return {
      success: true,
      evaluatedCartsCount: simulatedInactiveCarts.length,
      enqueuedJobs,
      emailsSentCount,
    };
  }

  // Get Abandoned Cart Jobs Queue History
  static getAbandonedCartJobs(): AbandonedCartJob[] {
    return abandonedCartJobsQueue;
  }

  // 4. Generate Dynamic Sitemap XML
  static generateSitemapXml(productSlugs: string[] = ['hydrating-moisturizer', 'niacinamide-serum']): string {
    const baseUrl = 'https://carebeautysolution.com';

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/cart', priority: '0.7', changefreq: 'weekly' },
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/contact', priority: '0.5', changefreq: 'monthly' },
    ];

    const productPages = productSlugs.map((slug) => ({
      url: `/product/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

    const allPages = [...staticPages, ...productPages];

    const urlEntries = allPages
      .map(
        (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`.trim();
  }

  // 5. Generate Robots.txt
  static generateRobotsTxt(): string {
    return `# Robots.txt for Care Beauty Solution
User-agent: *
Allow: /
Allow: /product/
Allow: /products
Disallow: /admin
Disallow: /api/
Disallow: /checkout

Sitemap: https://carebeautysolution.com/sitemap.xml
`.trim();
  }
}

export const marketingService = MarketingService;
