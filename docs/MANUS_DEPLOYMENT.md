# Manus Deployment Guide

Complete guide for deploying Berlin Real Estate Analytics on Manus platform and configuring custom domain **sky-mind.com**.

---

## Why Manus?

Manus provides the ideal hosting environment for this full-stack application with several key advantages over alternatives like Vercel or traditional VPS hosting.

**Built-in Infrastructure**: The platform includes pre-configured MySQL/TiDB database, OAuth authentication, file storage (S3), and LLM APIs without additional setup. All environment variables are automatically injected at runtime, eliminating manual configuration.

**No Serverless Limitations**: Unlike Vercel's serverless functions with cold starts and 10-second timeouts, Manus runs a persistent Node.js server that maintains database connections and handles long-running operations efficiently.

**One-Click Deployment**: The checkpoint system allows instant rollback to any previous version, and the Publish button deploys changes to production in seconds with zero downtime.

**Cost-Effective**: Manus includes hosting, database, storage, and CDN in a single subscription, avoiding the complexity of managing multiple services and their associated costs.

---

## Current Status

Your project is already running on Manus at the development URL:

**Development URL**: `https://3000-i4d9gy9blm7qdcft5wv73-0709007b.sg1.manus.computer`

This URL provides full functionality including:
- Interactive demographic dashboards for Berlin, Munich, Hamburg, and Cologne
- Mapbox-powered interactive maps with district boundaries
- City comparison with charts and statistics
- District filtering and comparison features
- CSV export functionality
- All 10 tests passing in CI/CD pipeline

---

## Deployment Steps

### Step 1: Create Checkpoint

Before publishing, ensure all changes are saved in a checkpoint. The latest checkpoint has already been created:

**Latest Checkpoint**: `39704ae1` - "Added CI badges, comprehensive CHANGELOG, and GitHub Secrets documentation"

To create a new checkpoint if needed:

1. Open the Management UI (right panel)
2. Verify all features work correctly in the Preview panel
3. The checkpoint will be created automatically when you're ready to publish

### Step 2: Publish to Production

Publishing makes your application publicly accessible with a stable URL and enables custom domain configuration.

**How to Publish:**

1. Click the **Publish** button in the Management UI header (top-right corner)
2. The system will deploy the latest checkpoint to production
3. You'll receive a production URL (format: `https://your-project.manus.space`)
4. The deployment process takes approximately 30-60 seconds

**What Happens During Publish:**

- Frontend assets are built and optimized for production
- Backend server is deployed with all environment variables
- Database connections are established
- SSL certificate is automatically provisioned
- CDN caching is configured for static assets

### Step 3: Configure Custom Domain (sky-mind.com)

After publishing, you can bind your custom domain **sky-mind.com** to the Manus application.

**Domain Configuration Steps:**

1. **Open Domain Settings**
   - Go to Management UI → Settings → Domains
   - Click "Add Custom Domain"

2. **Enter Your Domain**
   - Input: `sky-mind.com` (or `www.sky-mind.com` if you prefer)
   - Click "Add Domain"

3. **Configure DNS Records**
   
   Manus will provide DNS configuration instructions. You'll need to add records in your domain registrar's DNS settings.

   **For Root Domain (sky-mind.com):**
   ```
   Type: A
   Name: @
   Value: [IP address provided by Manus]
   TTL: 3600
   ```

   **For WWW Subdomain (www.sky-mind.com):**
   ```
   Type: CNAME
   Name: www
   Value: [CNAME target provided by Manus]
   TTL: 3600
   ```

   **Alternative: CNAME for Root Domain (if supported by registrar):**
   ```
   Type: CNAME
   Name: @
   Value: [CNAME target provided by Manus]
   TTL: 3600
   ```

4. **SSL Certificate**
   
   Manus automatically provisions and renews SSL certificates via Let's Encrypt. The process takes 5-10 minutes after DNS propagation.

5. **Verify Domain**
   
   After adding DNS records:
   - Wait 5-30 minutes for DNS propagation (use `dig sky-mind.com` to check)
   - Click "Verify" in Manus Domain Settings
   - Once verified, your site will be accessible at `https://sky-mind.com`

---

## DNS Configuration Details

### Where to Configure DNS

DNS records are managed through your domain registrar or DNS provider. Common providers include:

- **Namecheap**: Dashboard → Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → Domains → DNS → Manage Zones
- **Cloudflare**: Dashboard → DNS → Records
- **Google Domains**: My Domains → DNS
- **Route 53 (AWS)**: Hosted Zones → Create Record Set

### DNS Propagation Time

DNS changes can take anywhere from 5 minutes to 48 hours to propagate globally, though most changes are visible within 1-2 hours.

**Check DNS Propagation:**
```bash
# Check A record
dig sky-mind.com

# Check CNAME record
dig www.sky-mind.com

# Check from multiple locations
https://www.whatsmydns.net/#A/sky-mind.com
```

### Recommended DNS Settings

**TTL (Time To Live)**: Set to 3600 seconds (1 hour) initially. After confirming everything works, you can increase to 86400 (24 hours) for better caching.

**WWW Redirect**: Configure `www.sky-mind.com` to redirect to `sky-mind.com` (or vice versa) to avoid duplicate content. Manus handles this automatically once both domains are configured.

**DNSSEC**: If your registrar supports DNSSEC, keep it enabled for additional security. Manus is compatible with DNSSEC-enabled domains.

---

## Environment Variables

All required environment variables are automatically configured in Manus:

| Variable | Description | Auto-Configured |
|----------|-------------|-----------------|
| `DATABASE_URL` | MySQL/TiDB connection string | ✅ Yes |
| `JWT_SECRET` | Session signing secret | ✅ Yes |
| `VITE_APP_ID` | Manus OAuth app ID | ✅ Yes |
| `OAUTH_SERVER_URL` | OAuth backend URL | ✅ Yes |
| `VITE_OAUTH_PORTAL_URL` | OAuth frontend URL | ✅ Yes |
| `BUILT_IN_FORGE_API_URL` | Manus APIs base URL | ✅ Yes |
| `BUILT_IN_FORGE_API_KEY` | Server-side API key | ✅ Yes |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | ✅ Yes |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API URL | ✅ Yes |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox token | ✅ Yes (user-provided) |

**No manual configuration needed** - all variables are injected at runtime by the Manus platform.

---

## Post-Deployment Checklist

After publishing and configuring your custom domain, verify the following:

### Functionality Tests

- [ ] Homepage loads at `https://sky-mind.com`
- [ ] City selector switches between Berlin, Munich, Hamburg, Cologne
- [ ] Religious infrastructure counts display correctly
- [ ] Community composition sparklines render
- [ ] Map page loads with Mapbox visualization
- [ ] District boundaries and markers display on map
- [ ] City Comparison page shows charts and tables
- [ ] Districts page with filtering works
- [ ] District comparison modal functions
- [ ] CSV export downloads data
- [ ] All navigation links work

### Performance Tests

- [ ] Initial page load < 3 seconds
- [ ] Map renders within 2 seconds
- [ ] API responses < 500ms
- [ ] Images load quickly (custom icons)
- [ ] No console errors in browser

### SEO and Metadata

- [ ] Page title displays correctly
- [ ] Favicon appears in browser tab
- [ ] Meta description is set
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is configured

---

## Monitoring and Maintenance

### Analytics

Manus provides built-in analytics accessible via Management UI → Dashboard:

- **UV (Unique Visitors)**: Daily and monthly unique visitor counts
- **PV (Page Views)**: Total page views with breakdown by page
- **Traffic Sources**: Referrer analysis
- **Geographic Distribution**: Visitor locations

### Database Management

Access database directly through Management UI → Database:

- **CRUD Operations**: View, edit, add, delete records
- **SQL Console**: Run custom queries
- **Backups**: Automatic daily backups (retained for 7 days)
- **Connection Info**: Full credentials in settings (enable SSL)

### Logs and Debugging

View application logs in real-time:

1. Open Management UI → Preview
2. Click "Console" tab
3. View server logs, errors, and API requests

For production logs:
- Server errors are logged automatically
- Access logs available in Dashboard → Analytics

---

## Rollback and Version Control

### Rollback to Previous Version

If issues arise after deployment:

1. Go to Management UI → Checkpoints (in chat history)
2. Find the previous working checkpoint
3. Click "Rollback" button
4. Confirm rollback - takes ~30 seconds

### Create New Checkpoint

Before making major changes:

1. Test changes in Preview panel
2. Checkpoint is created automatically
3. Name format: "Description of changes"
4. All checkpoints are preserved indefinitely

---

## Troubleshooting

### Domain Not Resolving

**Symptom**: `sky-mind.com` shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Solution**:
1. Verify DNS records are correct (check with `dig sky-mind.com`)
2. Wait for DNS propagation (up to 48 hours)
3. Clear browser DNS cache: `chrome://net-internals/#dns` → "Clear host cache"
4. Try incognito mode to bypass browser cache

### SSL Certificate Error

**Symptom**: "Your connection is not private" or "NET::ERR_CERT_COMMON_NAME_INVALID"

**Solution**:
1. Wait 10-15 minutes after DNS propagation for SSL provisioning
2. Verify domain is correctly configured in Manus Domain Settings
3. Check that DNS points to correct Manus IP/CNAME
4. Contact Manus support if issue persists after 1 hour

### Map Not Loading

**Symptom**: Black screen on Map page

**Solution**:
1. Verify `VITE_MAPBOX_ACCESS_TOKEN` is set in Manus Secrets
2. Check Mapbox token is valid and not expired
3. Ensure token has required scopes (styles:read, fonts:read)
4. Check browser console for specific error messages

### Database Connection Errors

**Symptom**: "Cannot connect to database" or timeout errors

**Solution**:
1. Database is automatically configured by Manus - no action needed
2. If errors persist, check Management UI → Database → Settings
3. Verify database is running (should show "Active" status)
4. Restart server via Management UI if needed

### Performance Issues

**Symptom**: Slow page loads or API timeouts

**Solution**:
1. Check Dashboard → Analytics for traffic spikes
2. Optimize database queries (add indexes if needed)
3. Enable CDN caching for static assets (automatic in Manus)
4. Consider upgrading Manus plan for higher resource limits

---

## Custom Domain Best Practices

### Use HTTPS Only

Always redirect HTTP to HTTPS. Manus handles this automatically, but verify:
```bash
curl -I http://sky-mind.com
# Should return 301 redirect to https://sky-mind.com
```

### Configure WWW Redirect

Decide on canonical domain:
- **Option A**: `sky-mind.com` (root) as primary, redirect `www.sky-mind.com` to it
- **Option B**: `www.sky-mind.com` as primary, redirect `sky-mind.com` to it

Manus automatically handles redirects once both domains are added.

### Set Up Email

If you want email at your domain (e.g., `contact@sky-mind.com`):
1. Add MX records in DNS settings
2. Use email provider like Google Workspace, Zoho Mail, or ProtonMail
3. Keep A/CNAME records for website separate from MX records

### Monitor Uptime

Use external monitoring services:
- **UptimeRobot**: Free monitoring with 5-minute checks
- **Pingdom**: Detailed performance monitoring
- **StatusCake**: Multi-location monitoring

Set up alerts to notify you if `https://sky-mind.com` goes down.

---

## Support and Resources

### Manus Support

- **Documentation**: https://docs.manus.im
- **Help Center**: https://help.manus.im
- **Community**: Manus Discord/Forum (check platform for links)

### Project-Specific Help

- **GitHub Repository**: https://github.com/danvolsky-source/berlin-real-estate-analytics
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions

### External Resources

- **Mapbox Documentation**: https://docs.mapbox.com
- **tRPC Documentation**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs

---

## Next Steps After Deployment

Once your site is live at `https://sky-mind.com`, consider these enhancements:

### Analytics and Tracking

Add Google Analytics or Plausible for deeper insights:
1. Create analytics account
2. Add tracking script to `client/index.html`
3. Configure goals and conversions

### SEO Optimization

Improve search engine visibility:
1. Submit sitemap to Google Search Console
2. Add structured data (JSON-LD) for rich snippets
3. Optimize meta descriptions and titles
4. Create robots.txt with sitemap reference

### Performance Monitoring

Set up performance tracking:
1. Enable Lighthouse CI in GitHub Actions
2. Monitor Core Web Vitals
3. Set performance budgets
4. Optimize images with WebP format

### User Feedback

Collect user feedback:
1. Add feedback form or widget
2. Integrate with Manus notification API
3. Monitor user behavior with heatmaps (Hotjar, Microsoft Clarity)

---

## Conclusion

Your Berlin Real Estate Analytics platform is production-ready and optimized for deployment on Manus. The combination of built-in infrastructure, automatic scaling, and simple domain configuration makes Manus the ideal hosting choice for this full-stack application.

After publishing and configuring **sky-mind.com**, your demographic analysis platform will be accessible to users worldwide with enterprise-grade reliability, security, and performance.

For any questions or issues during deployment, refer to the troubleshooting section above or contact Manus support through the help center.
