# Deployment

This is a dependency-free static site. Publish the project folder as-is; the site has no build command. `index.html` uses paths relative to the page so its CSS, JavaScript, and artwork also work when hosted under a project subpath.

Before publishing:

- Add the approved artwork photos listed in [IMAGE-GUIDE.txt](IMAGE-GUIDE.txt), or keep the built-in artwork placeholders.
- Set `CONTACT_EMAIL` in `js/script.js` if commission email drafts should be enabled.
- Open the deployed URL and test section links, the mobile menu, the artwork reveal dialog, and the contact form.

## GitHub Pages

1. Push the project files to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the publishing branch and the repository root (`/`) as the folder, then save.
5. Wait for the Pages deployment to finish and open the URL shown in the Pages settings.

The root `index.html` is the entry point. Relative `css/`, `js/`, and `images/` paths support both user/organization sites and repository project sites served beneath a path such as `/repository-name/`.

## Netlify

### Deploy by uploading

1. Open Netlify and choose **Add new site → Deploy manually**.
2. Drag the project folder (containing `index.html`, `css/`, and `js/`) into the deployment area.
3. Open the generated site URL and verify the site.

### Deploy from Git

1. Choose **Add new site → Import an existing project** and connect the repository.
2. Set the **Base directory** to the repository root.
3. Leave the **Build command** empty.
4. Set the **Publish directory** to `.` (the repository root), then deploy.

No redirects or server functions are required for this single-page site; section navigation uses normal in-page anchors.

## Add a custom domain later

1. Add the domain in the hosting provider's domain settings.
2. Follow that provider's current DNS instructions at the registrar: this commonly means a CNAME for a subdomain or provider-specified A/ALIAS records for an apex domain.
3. Keep DNS values specific to the selected host; do not copy records from another provider.
4. Wait for DNS propagation, verify the domain in the host dashboard, and enable its managed HTTPS certificate.
5. Test both the custom domain and any provider preview URL after activation.

The domain registrar controls DNS, while the hosting provider controls which site receives the traffic and provisions HTTPS.
