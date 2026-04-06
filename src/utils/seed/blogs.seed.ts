import { db } from '../../configs/db';
import { articleCategories, articles, articleToCategories, users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger';

const IMAGES = [
  'https://www.saveur.com/uploads/2019/03/07/CKZA2TR45TLW4KHAPJY7E6GT3I.jpg?auto=webp',
  'https://i.ytimg.com/vi/ZRKzhmWA8Wg/hqdefault.jpg',
  'https://olololodge.com/wp-content/uploads/Karunguru-Coffee-Farm-1024x683.jpg',
  'https://www.solaicoffee.com/web/image/11918-d05f9a94/Farm%20activities_1.jpg?access_token=b4c5e657-2f5d-4bec-8a29-6b47d4ea6bd1'
];

const categoriesData = [
  { name: 'East African Origins', slug: 'east-african-origins' },
  { name: 'Harvesting & Processing', slug: 'harvesting-processing' },
  { name: 'Sustainability & Fair Trade', slug: 'sustainability-fair-trade' },
  { name: 'Emara Coffee Initiatives', slug: 'emara-coffee-initiatives' }
];

export const seedBlogs = async () => {
  try {
    const adminUsers = await db.select().from(users).where(eq(users.role, 'ADMIN')).limit(1);
    if (adminUsers.length === 0) {
      return;
    }
    const adminId = adminUsers[0].id;

    await db.delete(articleToCategories);
    await db.delete(articles);
    await db.delete(articleCategories);

    const insertedCategories = await db.insert(articleCategories).values(categoriesData).returning();

    const catMap = {
      origins: insertedCategories.find(c => c.slug === 'east-african-origins')!.id,
      harvesting: insertedCategories.find(c => c.slug === 'harvesting-processing')!.id,
      sustainability: insertedCategories.find(c => c.slug === 'sustainability-fair-trade')!.id,
      initiatives: insertedCategories.find(c => c.slug === 'emara-coffee-initiatives')!.id,
    };

    const blogsData = [
      {
        title: 'The Rich Legacy of Kenyan Coffee Plantations',
        slug: 'rich-legacy-kenyan-coffee-plantations',
        categoryId: catMap.initiatives,
        content: `
          <p>The high altitudes and rich, red volcanic soils of Mount Kenya provide an unparalleled environment for cultivating some of the world's most sought-after coffee beans. Known globally for their bright acidity, complex fruit notes, and full-bodied aroma, Kenyan Arabica beans—particularly the SL28 and SL34 varietals—represent the pinnacle of East African agriculture.</p>
          <p>Growing these exquisite beans requires intense dedication. From nursing the saplings to managing the delicate shade canopies that protect the cherries from the harsh equatorial sun, the agricultural journey is steeped in generations of local expertise. However, cultivating a world-class bean is only half the battle. The true challenge lies in preserving that peak freshness and distinct flavor profile as the coffee moves from the rural highlands to the global market.</p>
          <h3>Emara Coffee's Distribution Excellence</h3>
          <p>This is where Emara Coffee steps in as a vital pillar of the Kenyan coffee economy. As a premier distributing company headquartered in Kenya, Emara Coffee has revolutionized the logistics of coffee export. We understand that time and temperature are the enemies of green coffee.</p>
          <p>Emara Coffee has established a state-of-the-art logistics network that seamlessly connects remote highland plantations to our central distribution hubs in Nairobi, and ultimately to the port of Mombasa. By utilizing climate-controlled transport and rigorous quality-tracking systems, Emara Coffee ensures that the vibrant, wine-like acidity characteristic of Kenyan coffee is perfectly preserved. Our distribution infrastructure not only accelerates the journey to roasters worldwide but also minimizes degradation, guaranteeing that every bag distributed by Emara Coffee carries the true, uncompromised essence of Kenya.</p>
        `,
      },
      {
        title: 'Empowering Women in Uganda\'s Coffee Harvest',
        slug: 'empowering-women-uganda-coffee-harvest',
        categoryId: catMap.sustainability,
        content: `
          <p>In the lush, mist-covered foothills of the Rwenzori Mountains in Uganda, coffee is more than a cash crop; it is the lifeblood of the community. Here, both exceptional Robusta and highly rated Arabica beans are cultivated. But perhaps the most vital component of the Ugandan coffee industry is the women who form the backbone of the harvest.</p>
          <p>Women are responsible for the vast majority of the meticulous hand-picking required to select only the ripest red cherries. This selective harvesting is crucial, as a single under-ripe or over-ripe cherry can taint an entire batch. Despite their critical role, female farmers have historically faced systemic barriers regarding land ownership and fair compensation in the broader agricultural market.</p>
          <h3>Fair Trade and Emara Coffee's Commitment</h3>
          <p>Recognizing this disparity, Emara Coffee has made female empowerment a cornerstone of our regional distribution strategy. While our primary operations are based in Kenya, our distribution network actively supports cross-border cooperatives that guarantee fair wages to female laborers in Uganda.</p>
          <p>Emara Coffee’s transparent supply chain model eliminates exploitative middlemen. By acting as a direct distribution partner, we ensure that a significantly higher percentage of the final export value returns directly to the Ugandan communities. Furthermore, Emara Coffee sponsors regional workshops focused on advanced processing techniques and financial literacy for women in the coffee sector. Through our equitable distribution practices, Emara Coffee is not just trading beans; we are distributing wealth, knowledge, and opportunity back to the women who cultivate the soul of East African coffee.</p>
        `,
      },
      {
        title: 'Preserving the Heirloom Varietals of Ethiopia',
        slug: 'preserving-heirloom-varietals-ethiopia',
        categoryId: catMap.origins,
        content: `
          <p>Ethiopia is globally revered as the birthplace of Coffea arabica. Unlike other regions where coffee was introduced commercially, coffee grows wild in the diverse microclimates of Ethiopia. The regions of Yirgacheffe, Sidamo, and Harrar produce thousands of distinct, undocumented heirloom varietals, each offering an intoxicating array of flavor profiles ranging from intense jasmine and bergamot to deep blueberry and cocoa.</p>
          <p>The traditional Ethiopian method of coffee farming remains deeply organic and integrated into the natural forest ecosystem. Smallholder farmers carefully hand-pick these heirloom cherries, processing them through either traditional sun-drying on raised beds or meticulous washing techniques. However, the delicate nature of these diverse beans makes them incredibly susceptible to quality loss during transit.</p>
          <h3>Bridging Origins with Emara Coffee</h3>
          <p>Emara Coffee serves as the crucial bridge between these ancient Ethiopian traditions and the demanding modern market. Recognizing the logistical challenges of exporting from landlocked Ethiopia, Emara Coffee leverages its robust Kenyan-based distribution network to facilitate smoother, more reliable export routes for regional premium coffees.</p>
          <p>Our contribution lies in our advanced consolidation and grading facilities. Emara Coffee provides specialized logistics that separate and protect the distinct micro-lots of Ethiopian heirloom coffees during the distribution process. By applying our Kenyan logistical expertise to the broader East African market, Emara Coffee guarantees that the floral and fruity complexities of Ethiopian beans reach international roasters with their origin identity entirely intact. We are proud to be the trusted distributors of coffee's greatest heritage.</p>
        `,
      },
      {
        title: 'Community and Cooperative Milling in Kenya',
        slug: 'community-cooperative-milling-kenya',
        categoryId: catMap.harvesting,
        content: `
          <p>The harvest season in Kenya is a vibrant, communal event. Across the central highlands, groups of farmers, heavily driven by women's cooperatives, come together to undertake the labor-intensive process of harvesting. The Kenyan system relies heavily on centralized washing stations, known as factories, which are owned by farmer cooperative societies.</p>
          <p>Once the day's picking is complete, the cherries are immediately transported to these cooperative factories for pulping, fermenting, and washing. This highly regulated, centralized processing is what gives Kenyan coffee its famous clean cup and consistent grading (such as the prestigious AA and AB grades). The success of this system depends entirely on community trust, synchronized labor, and incredibly efficient post-harvest logistics.</p>
          <h3>Emara Coffee's Infrastructure Investments</h3>
          <p>Emara Coffee is deeply embedded in this cooperative ecosystem. As a leading Kenyan distributing company, our contribution goes far beyond simply buying the finished product. Emara Coffee actively invests in the logistical infrastructure that supports these washing stations.</p>
          <p>We provide the critical transport networks that move the parchment coffee from rural cooperative factories to the dry mills in Nairobi safely and swiftly. Emara Coffee's distribution model is built on long-term partnerships with these farming groups. We supply data-driven market insights back to the cooperatives, helping them align their processing volumes with global demand. By acting as the premier distribution arm for Kenyan cooperatives, Emara Coffee ensures that the communal effort of the harvest translates into sustainable economic growth for the farmers, cementing Kenya's reputation as a global powerhouse in specialty coffee.</p>
        `,
      }
    ];

    const finalArticlesToInsert = blogsData.map((blog, index) => ({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      authorId: adminId,
      thumbnailUrl: IMAGES[index], 
      status: 'PUBLISHED' as const,
      viewsCount: Math.floor(Math.random() * 1500) + 100, 
      likesCount: Math.floor(Math.random() * 300), 
      dislikesCount: Math.floor(Math.random() * 10),
      publishedAt: new Date(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) 
    }));

    const insertedArticles = await db.insert(articles).values(finalArticlesToInsert).returning();

    const articleCategoryMappings = blogsData.map((blog, index) => ({
      articleId: insertedArticles[index].id,
      categoryId: blog.categoryId
    }));

    await db.insert(articleToCategories).values(articleCategoryMappings);

  } catch (error) {
    logger.error(error);
  }
};