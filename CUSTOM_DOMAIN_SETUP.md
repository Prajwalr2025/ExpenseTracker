# 🌐 Custom Domain Setup for Expense Tracker

## 🎯 **Custom Domain Configuration Guide**

You can serve your Expense Tracker from your own custom domain instead of `prajwalr2025.github.io`!

## 📋 **Prerequisites**
- ✅ Your repository: `Prajwalr2025/ExpenseTracker`
- ✅ A domain name (purchased from registrar like Namecheap, GoDaddy, etc.)
- ✅ Access to your domain's DNS settings

## 🔧 **Setup Steps**

### **Step 1: Configure GitHub Pages**
1. Go to your repository: `https://github.com/Prajwalr2025/ExpenseTracker`
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Custom domain**, enter your domain (e.g., `expensetracker.yourdomain.com`)
5. Click **Save**

### **Step 2: DNS Configuration**

#### **Option A: Subdomain (Recommended)**
For a subdomain like `expensetracker.yourdomain.com`:

**Add CNAME Record:**
```
Type: CNAME
Name: expensetracker (or your chosen subdomain)
Value: prajwalr2025.github.io
TTL: 3600 (or default)
```

#### **Option B: Apex Domain**
For root domain like `yourdomain.com`:

**Add A Records:**
```
Type: A
Name: @ (or blank)
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @ (or blank)
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @ (or blank)
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @ (or blank)
Value: 185.199.111.153
TTL: 3600
```

**Add AAAA Records (IPv6):**
```
Type: AAAA
Name: @ (or blank)
Value: 2606:50c0:8000::153
TTL: 3600

Type: AAAA
Name: @ (or blank)
Value: 2606:50c0:8001::153
TTL: 3600

Type: AAAA
Name: @ (or blank)
Value: 2606:50c0:8002::153
TTL: 3600

Type: AAAA
Name: @ (or blank)
Value: 2606:50c0:8003::153
TTL: 3600
```

### **Step 3: Create CNAME File**
GitHub Pages needs a CNAME file in your repository root:

1. In your repository, create a file named `CNAME` (no extension)
2. Add your custom domain as the only content:
```
expensetracker.yourdomain.com
```

### **Step 4: Enable HTTPS**
1. After DNS propagation (24-48 hours), return to GitHub Pages settings
2. Check **"Enforce HTTPS"** for security

## 🌟 **Popular Domain Registrars & DNS Setup**

### **Namecheap**
1. Login → Domain List → Manage
2. Advanced DNS → Add New Record
3. Add CNAME record as shown above

### **GoDaddy**
1. My Products → DNS → Manage Zones
2. Add Record → CNAME
3. Enter subdomain and GitHub Pages URL

### **Cloudflare**
1. DNS → Add Record
2. Type: CNAME, Name: subdomain, Content: prajwalr2025.github.io
3. Proxy status: DNS only (gray cloud)

### **Google Domains**
1. DNS → Custom resource records
2. Add CNAME record with your subdomain

## ⏱️ **Timeline**
- **DNS Propagation**: 24-48 hours (sometimes faster)
- **SSL Certificate**: Automatic after propagation
- **GitHub Pages Build**: 5-10 minutes

## 🔍 **Verification**
Check if your domain is working:
```bash
# Check DNS propagation
nslookup expensetracker.yourdomain.com

# Check if site is accessible
curl -I https://expensetracker.yourdomain.com
```

## 🎯 **Example Custom Domains**
- `expense.yourdomain.com`
- `tracker.yourdomain.com`
- `budget.yourdomain.com`
- `money.yourdomain.com`

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **"Domain is not properly configured"**
   - Wait for DNS propagation (up to 48 hours)
   - Verify CNAME record is correct

2. **"There isn't a GitHub Pages site here"**
   - Ensure CNAME file exists in repository
   - Check branch is correctly set in Pages settings

3. **SSL Certificate Issues**
   - Wait for DNS to fully propagate
   - Try unchecking and rechecking "Enforce HTTPS"

### **DNS Propagation Check Tools:**
- [whatsmydns.net](https://whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)

## 📱 **Your Expense Tracker Features**
Once live on your custom domain, users will enjoy:
- ✨ Modern spring-based animations
- 🌓 Light/Dark theme toggle
- 📱 Fully responsive design
- 💾 Persistent local storage
- 🔍 Advanced search & filtering
- 🎨 Particle effects and micro-interactions
- 💰 Complete expense management

## 🎉 **Final Result**
Your professional Expense Tracker will be accessible at:
`https://expensetracker.yourdomain.com` (or your chosen domain)

**Need help with any specific registrar or having issues? Let me know!**