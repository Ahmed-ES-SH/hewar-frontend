/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // اسم النطاق الأساسي لموقعك
  // **يجب عليك تغيير هذا إلى نطاقك الفعلي**
  siteUrl: "https://dcpc.org.sy",

  // صيغة ملف Sitemap
  generateRobotsTxt: true,

  // الخيارات الخاصة بملف robots.txt
  robotsTxtOptions: {
    // توجيهات خاصة لملف robots.txt
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      // توجيهات لمنع فهرسة المسارات الخاصة/المقيدة
      {
        userAgent: "*",
        disallow: ["/dashboard", "/forbidden", "/login"],
      },
    ],
    // إضافة مسار sitemap إلى ملف robots.txt
    additionalSitemaps: ["https://dcpc.org.sy/server-sitemap.xml"],
  },

  // استثناء المسارات التي لا يجب أن تكون في خريطة الموقع الرئيسية
  // (هذه تتوافق مع التوجيهات في robots.txt لمنع الفهرسة)
  exclude: [
    "/dashboard",
    "/forbidden",
    "/login",
    // إذا كنت تستخدم مجلد [locale] لترجمة المسارات، فربما تحتاج لاستبعاده أيضًا إذا كنت تتعامل مع اللغات بطريقة أخرى
    "/locale",
    "/locale/*", // استثناء أي شيء داخل مجلد [locale]
  ],

  // المسارات العامة التي يجب أن تكون في خريطة الموقع
  // (المسارات التي ستُفهرس بشكل افتراضي بناءً على هيكل مجلد pages/app)
  // المسارات الثابتة المضمنة في الهيكل الذي أظهرته:
  // - /about
  // - /blog (مُحتمل أن تكون ثابتة أو ديناميكية)
  // - /centerbranches
  // - /contact
  // - /news (مُحتمل أن تكون ثابتة أو ديناميكية)
  // - /ourwork
  // - /layout.tsx (سيتم تجاهلها)
  // - /page.tsx (تُمثل المسار الجذر /)
};
