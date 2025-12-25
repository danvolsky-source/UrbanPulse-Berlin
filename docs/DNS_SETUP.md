# DNS Configuration for sky-mind.com

Quick reference guide for configuring DNS records to point **sky-mind.com** to your Manus-hosted Berlin Real Estate Analytics application.

---

## Prerequisites

Before configuring DNS, you must:

1. ✅ Publish your Manus project (click "Publish" button in Management UI)
2. ✅ Add custom domain in Manus (Settings → Domains → Add Custom Domain)
3. ✅ Obtain DNS configuration values from Manus (IP address or CNAME target)

---

## DNS Records to Add

Manus will provide specific values after you add your custom domain. The configuration typically follows one of these patterns:

### Option A: A Record (Most Common)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `[IP from Manus]` | 3600 |
| CNAME | www | `[CNAME from Manus]` | 3600 |

**Example:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.manus.space
TTL: 3600
```

### Option B: CNAME for Root (If Supported)

Some DNS providers (Cloudflare, DNSimple) support CNAME flattening for root domains:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | `[CNAME from Manus]` | 3600 |
| CNAME | www | `[CNAME from Manus]` | 3600 |

---

## Step-by-Step Instructions

### 1. Access Your DNS Provider

Log in to your domain registrar or DNS provider where **sky-mind.com** is registered.

**Common Providers:**
- **Namecheap**: Dashboard → Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → Domains → Manage DNS
- **Cloudflare**: Dashboard → DNS → Records
- **Google Domains**: My Domains → DNS
- **AWS Route 53**: Hosted Zones → Create Record

### 2. Add A Record for Root Domain

**For sky-mind.com (root domain):**

1. Click "Add New Record" or "Add Record"
2. Select **Type**: `A`
3. Enter **Name/Host**: `@` (represents root domain)
4. Enter **Value/Points to**: `[IP address from Manus]`
5. Set **TTL**: `3600` (1 hour)
6. Save the record

### 3. Add CNAME Record for WWW

**For www.sky-mind.com:**

1. Click "Add New Record"
2. Select **Type**: `CNAME`
3. Enter **Name/Host**: `www`
4. Enter **Value/Points to**: `[CNAME target from Manus]`
5. Set **TTL**: `3600`
6. Save the record

### 4. Wait for DNS Propagation

DNS changes take time to propagate globally:

- **Minimum**: 5-10 minutes
- **Typical**: 1-2 hours
- **Maximum**: 48 hours

**Check propagation status:**
```bash
# Check A record
dig sky-mind.com

# Check CNAME record
dig www.sky-mind.com

# Check globally
https://www.whatsmydns.net/#A/sky-mind.com
```

### 5. Verify in Manus

After DNS propagates:

1. Go to Manus Management UI → Settings → Domains
2. Click "Verify" next to sky-mind.com
3. Wait for SSL certificate provisioning (5-10 minutes)
4. Your site will be live at `https://sky-mind.com`

---

## Provider-Specific Instructions

### Namecheap

1. Log in to Namecheap account
2. Go to **Domain List** → Click **Manage** next to sky-mind.com
3. Click **Advanced DNS** tab
4. Click **Add New Record**
5. Add A record:
   - Type: `A Record`
   - Host: `@`
   - Value: `[IP from Manus]`
   - TTL: `Automatic` or `1 hour`
6. Add CNAME record:
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `[CNAME from Manus]`
   - TTL: `Automatic` or `1 hour`
7. Click **Save All Changes**

### GoDaddy

1. Log in to GoDaddy account
2. Go to **My Products** → **Domains**
3. Click **DNS** next to sky-mind.com
4. Scroll to **Records** section
5. Click **Add** button
6. Add A record:
   - Type: `A`
   - Name: `@`
   - Value: `[IP from Manus]`
   - TTL: `1 hour`
7. Add CNAME record:
   - Type: `CNAME`
   - Name: `www`
   - Value: `[CNAME from Manus]`
   - TTL: `1 hour`
8. Click **Save**

### Cloudflare

1. Log in to Cloudflare account
2. Select **sky-mind.com** domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add A record:
   - Type: `A`
   - Name: `@`
   - IPv4 address: `[IP from Manus]`
   - Proxy status: `Proxied` (orange cloud) or `DNS only` (gray cloud)
   - TTL: `Auto`
6. Add CNAME record:
   - Type: `CNAME`
   - Name: `www`
   - Target: `[CNAME from Manus]`
   - Proxy status: `Proxied` or `DNS only`
   - TTL: `Auto`
7. Click **Save**

**Note**: If using Cloudflare proxy (orange cloud), SSL/TLS mode should be set to "Full" or "Full (strict)" in SSL/TLS settings.

### Google Domains

1. Log in to Google Domains
2. Select **sky-mind.com**
3. Click **DNS** in left sidebar
4. Scroll to **Custom resource records**
5. Add A record:
   - Name: `@`
   - Type: `A`
   - TTL: `1H`
   - Data: `[IP from Manus]`
6. Add CNAME record:
   - Name: `www`
   - Type: `CNAME`
   - TTL: `1H`
   - Data: `[CNAME from Manus]`
7. Click **Add**

### AWS Route 53

1. Log in to AWS Console
2. Go to **Route 53** → **Hosted zones**
3. Select **sky-mind.com** hosted zone
4. Click **Create record**
5. Add A record:
   - Record name: (leave blank for root)
   - Record type: `A`
   - Value: `[IP from Manus]`
   - TTL: `3600`
   - Routing policy: `Simple routing`
6. Add CNAME record:
   - Record name: `www`
   - Record type: `CNAME`
   - Value: `[CNAME from Manus]`
   - TTL: `3600`
   - Routing policy: `Simple routing`
7. Click **Create records**

---

## Verification Commands

### Check DNS Resolution

```bash
# Check if A record resolves
dig sky-mind.com A

# Expected output:
# sky-mind.com.  3600  IN  A  [IP address]

# Check if CNAME resolves
dig www.sky-mind.com CNAME

# Expected output:
# www.sky-mind.com.  3600  IN  CNAME  [CNAME target]
```

### Test HTTP/HTTPS

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://sky-mind.com

# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://sky-mind.com

# Test HTTPS
curl -I https://sky-mind.com

# Expected: HTTP/2 200
```

### Check SSL Certificate

```bash
# View SSL certificate details
openssl s_client -connect sky-mind.com:443 -servername sky-mind.com < /dev/null

# Check certificate expiration
echo | openssl s_client -connect sky-mind.com:443 -servername sky-mind.com 2>/dev/null | openssl x509 -noout -dates
```

---

## Troubleshooting

### DNS Not Propagating

**Problem**: `dig sky-mind.com` still shows old IP or no result after 1 hour

**Solutions**:
1. Clear local DNS cache:
   - **macOS**: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
   - **Windows**: `ipconfig /flushdns`
   - **Linux**: `sudo systemd-resolve --flush-caches`
2. Check DNS from different location: https://www.whatsmydns.net
3. Verify records are saved in DNS provider dashboard
4. Check TTL of old records (if previously configured) - wait for old TTL to expire

### WWW Not Working

**Problem**: `sky-mind.com` works but `www.sky-mind.com` doesn't

**Solutions**:
1. Verify CNAME record for `www` is added
2. Check CNAME target is correct (no trailing dot unless required)
3. Wait for DNS propagation (CNAME can take longer than A records)
4. Test with `dig www.sky-mind.com CNAME`

### SSL Certificate Error

**Problem**: "Your connection is not private" or "NET::ERR_CERT_COMMON_NAME_INVALID"

**Solutions**:
1. Wait 10-15 minutes after DNS propagation for SSL provisioning
2. Verify domain is verified in Manus Domain Settings
3. Check that DNS points to correct Manus IP/CNAME
4. Clear browser SSL cache: Chrome → `chrome://net-internals/#sockets` → "Flush socket pools"
5. Try incognito mode to bypass browser cache

### Cloudflare Proxy Issues

**Problem**: Site not loading or SSL errors when using Cloudflare proxy (orange cloud)

**Solutions**:
1. Change SSL/TLS mode to "Full" or "Full (strict)" in Cloudflare dashboard
2. Temporarily disable proxy (gray cloud) to test direct connection
3. Ensure Manus IP is not blocked by Cloudflare firewall rules
4. Check Cloudflare SSL/TLS → Edge Certificates → Always Use HTTPS is enabled

---

## Advanced Configuration

### Subdomain for API

If you want a separate subdomain for API (e.g., `api.sky-mind.com`):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | api | `[CNAME from Manus]` | 3600 |

Then configure in Manus Domain Settings to handle `api.sky-mind.com` separately.

### Email Records (MX)

To use email at your domain (e.g., `contact@sky-mind.com`), add MX records:

**Example for Google Workspace:**
| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| MX | @ | `ASPMX.L.GOOGLE.COM` | 1 | 3600 |
| MX | @ | `ALT1.ASPMX.L.GOOGLE.COM` | 5 | 3600 |
| MX | @ | `ALT2.ASPMX.L.GOOGLE.COM` | 5 | 3600 |

**Note**: MX records do not affect website hosting - A/CNAME records for website and MX records for email coexist independently.

### CAA Records (Optional)

Add CAA records to specify which Certificate Authorities can issue certificates for your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CAA | @ | `0 issue "letsencrypt.org"` | 3600 |
| CAA | @ | `0 issuewild "letsencrypt.org"` | 3600 |

This enhances security by preventing unauthorized certificate issuance.

---

## Summary Checklist

Before considering DNS configuration complete, verify:

- [ ] A record for `@` (sky-mind.com) points to Manus IP
- [ ] CNAME record for `www` points to Manus CNAME
- [ ] DNS propagation complete (check with `dig` and whatsmydns.net)
- [ ] Domain verified in Manus Domain Settings
- [ ] SSL certificate provisioned (green padlock in browser)
- [ ] `http://sky-mind.com` redirects to `https://sky-mind.com`
- [ ] `https://www.sky-mind.com` works (or redirects to non-www)
- [ ] All pages load correctly on custom domain
- [ ] No mixed content warnings in browser console

---

## Support

If you encounter issues not covered in this guide:

1. Check Manus documentation: https://docs.manus.im
2. Contact Manus support: https://help.manus.im
3. Consult your DNS provider's support documentation
4. Open GitHub issue: https://github.com/danvolsky-source/berlin-real-estate-analytics/issues

---

**Last Updated**: December 25, 2025
