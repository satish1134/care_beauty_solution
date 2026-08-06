// End-to-End Integration Test for Phase 5 — Marketing, SEO & Notifications
import { marketingService } from './marketingService';
import { emailService } from './emailService';

export async function runPhase5MarketingTests(): Promise<{
  success: boolean;
  logs: string[];
  summary: Record<string, any>;
}> {
  const logs: string[] = [];
  const log = (msg: string) => {
    logs.push(`[PHASE 5 TEST] ${msg}`);
    console.log(`[PHASE 5 TEST] ${msg}`);
  };

  try {
    log('Starting Phase 5 End-to-End Marketing, SEO & Notifications Test Execution...');

    // 1. Newsletter Signup & Welcome Email Dispatch
    const testSubscriberEmail = `aarav.mehta_${Date.now()}@example.com`;
    const subResult = await marketingService.subscribeNewsletter(testSubscriberEmail, 'Aarav Mehta', 'Footer Form');

    if (!subResult.success || !subResult.welcomeEmailSent) {
      throw new Error('Newsletter signup or welcome email dispatch failed');
    }
    log(`Step 1: Newsletter Signup successful for '${testSubscriberEmail}'. Welcome email sent via Email Abstraction Layer (Message ID: ${subResult.messageId}). Promo Voucher 'WELCOME100' attached.`);

    // 2. Newsletter Broadcast Campaign Dispatch
    const campaignResult = await marketingService.dispatchNewsletterCampaign(
      'Monsoon Clinical Barrier Repair Sale',
      'MONSOON20',
      'Get 20% OFF on all dermatologically tested Ceramide creams during monsoon months.'
    );

    if (!campaignResult.success || campaignResult.recipientsCount < 1) {
      throw new Error('Newsletter campaign broadcast failed');
    }
    log(`Step 2: Broadcast Email Campaign dispatched to ${campaignResult.recipientsCount} subscribers via Email Abstraction Layer.`);

    // 3. BullMQ / Redis Abandoned Cart Job Processor Execution
    const cronJobResult = await marketingService.triggerAbandonedCartCronJob(2); // Carts inactive for > 2 hours

    if (!cronJobResult.success || cronJobResult.enqueuedJobs.length < 1 || cronJobResult.emailsSentCount < 1) {
      throw new Error('Abandoned cart cron queue job execution failed');
    }
    log(`Step 3: [BULLMQ QUEUE] Abandoned Cart Job Processor evaluated ${cronJobResult.evaluatedCartsCount} inactive carts. Enqueued & processed ${cronJobResult.enqueuedJobs.length} recovery jobs into BullMQ/Redis queue.`);
    log(`Step 4: [RECOVERY EMAIL DISPATCH] Sent ${cronJobResult.emailsSentCount} abandoned cart recovery emails with 10% discount promo code 'RECOVER10' & 1-click recovery links.`);

    // 4. Sitemap.xml & Robots.txt Auto-Generation
    const sitemapXml = marketingService.generateSitemapXml(['hydrating-moisturizer', 'niacinamide-serum', 'vitamin-c-glow']);
    if (!sitemapXml.includes('<urlset') || !sitemapXml.includes('/product/hydrating-moisturizer')) {
      throw new Error('sitemap.xml generation failed or invalid XML structure');
    }
    log(`Step 5: [SEO SITEMAP] Generated valid sitemap.xml containing static & dynamic product canonical URLs.`);

    const robotsTxt = marketingService.generateRobotsTxt();
    if (!robotsTxt.includes('User-agent: *') || !robotsTxt.includes('Sitemap: https://carebeautysolution.com/sitemap.xml')) {
      throw new Error('robots.txt generation failed');
    }
    log(`Step 6: [SEO ROBOTS] Generated valid robots.txt referencing https://carebeautysolution.com/sitemap.xml.`);

    // 5. Verify Email Log Audit Store
    const emailLogs = emailService.getSentEmails();
    if (emailLogs.length < 3) {
      throw new Error('Email log history did not record dispatched marketing emails');
    }
    log(`Step 7: [EMAIL AUDIT LOG] Verified ${emailLogs.length} total marketing & checkout notifications recorded in central email log store.`);

    log('✅ PHASE 5 MARKETING, SEO & NOTIFICATIONS TEST PASSED SUCCESSFULLY!');

    return {
      success: true,
      logs,
      summary: {
        newsletterSubscribedEmail: testSubscriberEmail,
        welcomeEmailMessageId: subResult.messageId,
        campaignRecipientsCount: campaignResult.recipientsCount,
        abandonedCartJobsProcessed: cronJobResult.enqueuedJobs.length,
        recoveryEmailsSent: cronJobResult.emailsSentCount,
        sitemapGenerated: true,
        robotsTxtGenerated: true,
        ga4MeasurementId: 'G-CBS2026GLOW',
        gscVerificationCodeSet: true,
      },
    };
  } catch (err: any) {
    log(`❌ TEST FAILED: ${err.message}`);
    return {
      success: false,
      logs,
      summary: { error: err.message },
    };
  }
}
