# StackWave Security Audit Checklist

## Smart Contracts
- [ ] **Reentrancy:** Ensure all external calls follow the checks-effects-interactions pattern.
- [ ] **Access Control:** Verify `onlyOwner` or similar modifiers are correctly applied to sensitive functions (mint, withdraw).
- [ ] **Integer Overflow/Underflow:** Using Solidity 0.8.x provides built-in overflow checks.
- [ ] **Token Gating:** Verify balance checks are performed on-chain where necessary.
- [ ] **Emergency Stop:** Implement a circuit breaker/pausable mechanism for critical contracts.

## Backend API
- [ ] **Authentication:** Verify SIWE signatures and use secure JWT sessions.
- [ ] **Rate Limiting:** Implement rate limiting on sensitive endpoints (auth, proposal creation).
- [ ] **Input Validation:** Use Zod to strictly validate all incoming request bodies and parameters.
- [ ] **CORS:** Configure restrictive CORS policies for the frontend domain.
- [ ] **Environment Secrets:** Never hardcode API keys or database credentials; use environment variables.

## Infrastructure
- [ ] **Database:** Ensure PostgreSQL is not publicly accessible and uses encrypted connections.
- [ ] **Secrets Management:** Use Replit Secrets or AWS Secrets Manager for sensitive keys.
- [ ] **Audit Logging:** Log all administrative actions and failed authentication attempts.
