# Comments and readership

## Article comments

[Giscus](https://giscus.app/) displays comments below published guides, architecture articles, investigations and blog posts. Landing pages, archives and drafts do not load the widget. Local development and hosted review previews do not connect to live discussions.

Anyone can read comments. Posting or reacting requires a GitHub account and the reader’s authorisation of Giscus. Comments are public and stored in [the blog repository’s Discussions](https://github.com/theaussiepom/homelab-blog/discussions/categories/announcements), in the Announcements category. That category allows maintainers and the Giscus app to start threads. Readers can reply. The first comment or reaction creates the thread; simply viewing an article does not create one.

Giscus needs metadata read access and Discussions read/write access to **homelab-blog only**. It does not need code or workflow access. Keep its installation limited to that repository. No app token or secret belongs in the site source; the repository and category identifiers in the component are public configuration.

Moderate through GitHub Discussions: edit or remove unsuitable comments, lock a conversation when necessary, and block abusive accounts. The comment area retains a GitHub link if the embedded widget is blocked. The widget loads as the reader approaches the end of an article and follows the site’s light/dark selection.

Threads are mapped to the article’s pathname using strict matching, so title edits retain comments. Preserve published paths. If an article must move, plan its redirect and discussion mapping together to avoid splitting the conversation. `giscus.json` restricts embedding to the canonical domain and production Worker hostname.

## Reading the traffic figures

Cloudflare Web Analytics was already configured for **theaussiepom.me**, using automatic setup, when inspected on 11 November 2026. No second analytics snippet is needed in the repository.

In the Cloudflare dashboard, open **Observability → Analytics → Web analytics**, select **theaussiepom.me**, then choose **Page views** or **Visits**. Select a date range and use **Path** for an individual article or **Referer** for the referring website. Keep the bot-exclusion filter enabled for readership reporting.

- **Page views:** pages loaded in browsers, including repeat views.
- **Visits:** entries from another website or a direct link. A visit may contain several page views. This is not a count of distinct people.
- **Worker asset requests:** requests for HTML, scripts, images and other files. These are useful for delivery health, but should not be reported as readers.

Browser analytics can miss readers who block the beacon or leave before it runs. Referrers may be absent or reduced by browsers and other sites. Local drafts are not readership traffic. Use trends and article-level comparisons rather than treating these figures as an exact audience census.

Operator IP exclusions are managed by production CD using the encrypted GitHub production parameter `ANALYTICS_EXCLUDED_IPS`. The [deployment configuration](deployment.md#analytics-exclusion-configuration) describes the separate zone-scoped credential, rule ownership, verification and address updates. This prevents future Web Analytics collection from the configured public addresses on the blog hostname; it does not filter old data or all requests in Cloudflare's other analytics products. No exclusion link or preferences page is published.

References: [Cloudflare metric definitions](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/), [available dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/), [Giscus configuration](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md).
