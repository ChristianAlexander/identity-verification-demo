# Firebase Storage Security Demo

This repository demonstrates a critical Firebase Storage security vulnerability where sensitive user documents (like ID verification photos) can be publicly accessible due to misconfigured storage rules.

## YouTube Video Companion

[![Watch the video](https://img.youtube.com/vi/mMvfBUNNKIY/maxresdefault.jpg)](https://youtu.be/mMvfBUNNKIY)

This repo accompanies the YouTube video explaining Firebase Storage security best practices. The demo shows how vulnerable storage rules can expose sensitive user data and how to properly secure them.

## The Vulnerability

The demo app simulates an ID verification system where users upload government-issued photo IDs. **With vulnerable storage rules, these sensitive documents become publicly accessible to anyone.**

## Key Files

- **`storage.rules`** - **VULNERABLE** rules that allow public access to all files
- **`storage-secure.rules`** - **SECURE** rules that properly restrict access

## Quick Demo

1. **Build and deploy with vulnerable rules:**
   ```bash
   cd react-app
   npm install
   npm run build
   cd ..
   firebase deploy
   ```

2. **Test the vulnerability:**
   - Upload an ID document as a user
   - Copy the image URL and open in incognito browser
   - **Anyone can access the sensitive document!**

3. **Fix the security issue:**
   ```bash
   cp storage-secure.rules storage.rules
   firebase deploy --only storage
   ```

## Rules Comparison

### Vulnerable (`storage.rules`)
```
match /{allPaths=**} {
  allow read, write: if true; // DANGEROUS!
}
```

### Secure (`storage-secure.rules`)
```
match /id-documents/{userId}/{fileName} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null &&
    firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

## Key Takeaway

**Always review your Firebase Storage rules!** Default configurations are often insecure and can expose sensitive user data.

---

**Disclaimer**: This is for educational purposes only. Never use vulnerable rules in production!
