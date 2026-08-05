// Unit Tests for Auth Service (Token Issuance, Expiry, Refresh Rotation, Rate Limiting)

import { authService, AuthService } from './authService';
import { mockSmsProvider } from './smsService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[TEST FAILED] ${message}`);
  }
}

async function runAuthUnitTests() {
  console.log('🧪 Starting Care Beauty Auth Service Unit Tests...\n');
  let passedCount = 0;

  // Test 1: Password Hashing & Verification
  try {
    const { hash, salt } = authService.hashPassword('CareBeauty2026!');
    assert(authService.verifyPassword('CareBeauty2026!', hash, salt) === true, 'Valid password verification failed');
    assert(authService.verifyPassword('WrongPassword', hash, salt) === false, 'Invalid password should not pass verification');
    console.log('✅ Test 1 Passed: Password hashing & verification logic');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
  }

  // Test 2: Access & Refresh Token Issuance
  try {
    const userId = 'usr-test-101';
    const accessToken = authService.generateAccessToken(userId, 'CUSTOMER', 'priya@example.com', '9876543210');
    const refreshToken = authService.generateRefreshToken(userId, 'CUSTOMER', 'priya@example.com', '9876543210');

    assert(Boolean(accessToken), 'Access token was not generated');
    assert(Boolean(refreshToken), 'Refresh token was not generated');

    const decodedAccess = authService.verifyJwt(accessToken);
    assert(decodedAccess !== null, 'Access token failed verification');
    assert(decodedAccess?.userId === userId, 'Access token payload userId mismatch');
    assert(decodedAccess?.type === 'access', 'Access token payload type mismatch');

    const decodedRefresh = authService.verifyJwt(refreshToken);
    assert(decodedRefresh !== null, 'Refresh token failed verification');
    assert(decodedRefresh?.type === 'refresh', 'Refresh token payload type mismatch');

    console.log('✅ Test 2 Passed: JWT Access and Refresh token issuance & payload verification');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
  }

  // Test 3: Refresh Token Rotation
  try {
    authService.clearStores();
    const userId = 'usr-test-102';
    const originalRefreshToken = authService.generateRefreshToken(userId, 'CUSTOMER', 'rahul@example.com', '9123456789');

    const rotationResult = authService.rotateRefreshToken(originalRefreshToken);
    assert(rotationResult.success === true, 'Token rotation should succeed');
    assert(Boolean(rotationResult.newAccessToken), 'New access token missing');
    assert(Boolean(rotationResult.newRefreshToken), 'New refresh token missing');
    assert(rotationResult.newRefreshToken !== originalRefreshToken, 'New refresh token should be distinct from old one');

    console.log('✅ Test 3 Passed: Refresh Token Rotation (issued new token pair)');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
  }

  // Test 4: Replay Attack Detection & Revocation
  try {
    const userId = 'usr-test-103';
    const refreshToken = authService.generateRefreshToken(userId, 'CUSTOMER');

    // First rotation succeeds
    const firstRotation = authService.rotateRefreshToken(refreshToken);
    assert(firstRotation.success === true, 'First rotation failed');

    // Attempting to reuse the revoked original token
    const replayAttempt = authService.rotateRefreshToken(refreshToken);
    assert(replayAttempt.success === false, 'Reused refresh token MUST fail');
    assert(replayAttempt.message?.includes('reuse') || replayAttempt.message?.includes('invalidated'), 'Should warn of reuse');

    console.log('✅ Test 4 Passed: Replay Attack Detection & Token Revocation');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
  }

  // Test 5: SMS Rate Limiting Trigger
  try {
    mockSmsProvider.clearRateLimits();
    const phone = '9876543210';

    const r1 = await mockSmsProvider.sendSms(phone, 'OTP 1');
    const r2 = await mockSmsProvider.sendSms(phone, 'OTP 2');
    const r3 = await mockSmsProvider.sendSms(phone, 'OTP 3');
    const r4 = await mockSmsProvider.sendSms(phone, 'OTP 4'); // Should be rate limited!

    assert(r1.success === true, '1st SMS failed');
    assert(r2.success === true, '2nd SMS failed');
    assert(r3.success === true, '3rd SMS failed');
    assert(r4.success === false, '4th SMS should be rate limited');
    assert(r4.error?.includes('Too many OTP requests') || false, 'Rate limit error message missing');

    console.log('✅ Test 5 Passed: SMS OTP Rate Limiting (max 3 per 15 mins)');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 5 Failed:', err.message);
  }

  // Test 6: Failed Login Rate Limiting
  try {
    authService.clearStores();
    const email = 'hacker@example.com';

    for (let i = 1; i <= 4; i++) {
      const res = authService.recordFailedAttempt(email);
      assert(res.blocked === false, `Attempt ${i} should not be blocked`);
    }

    const fifth = authService.recordFailedAttempt(email);
    assert(fifth.blocked === true, '5th failed login attempt MUST be blocked');
    assert(authService.isRateLimited(email) === true, 'User should be marked rate limited');

    console.log('✅ Test 6 Passed: Failed Login Rate Limiting (max 5 per 15 mins)');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 6 Failed:', err.message);
  }

  console.log(`\n🎉 Summary: ${passedCount}/6 Auth Service Unit Tests Passed Successfully!\n`);
}

// Execute tests directly when file is run
runAuthUnitTests().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
