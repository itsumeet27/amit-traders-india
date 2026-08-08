package com.amittraders.leather.config;

import com.amittraders.leather.entity.*;
import com.amittraders.leather.repository.*;
import com.amittraders.leather.util.SlugUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final boolean seedEnabled;
    private final AdminRepository adminRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final EnquiryRepository enquiryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            @Value("${app.seed.enabled:false}") boolean seedEnabled,
            AdminRepository adminRepository,
            CompanyProfileRepository companyProfileRepository,
            ProductCategoryRepository categoryRepository,
            ProductRepository productRepository,
            ClientRepository clientRepository,
            EnquiryRepository enquiryRepository,
            PasswordEncoder passwordEncoder) {
        this.seedEnabled = seedEnabled;
        this.adminRepository = adminRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.clientRepository = clientRepository;
        this.enquiryRepository = enquiryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Data seeding disabled");
            return;
        }
        if (adminRepository.count() > 0) {
            log.info("Admin table not empty — skipping seed");
            return;
        }

        log.info("Seeding SAMPLE data for Amit Traders India...");
        seedAdmin();
        seedCompanyProfile();
        var categories = seedCategories();
        seedProducts(categories);
        seedClients();
        seedEnquiries();
        log.info("SAMPLE seed completed");
    }

    private void seedAdmin() {
        adminRepository.save(Admin.builder()
                .name("Amit Traders Admin")
                .email("admin@amittraders.com")
                .password(passwordEncoder.encode("Admin@12345"))
                .role("ADMIN")
                .build());
    }

    private void seedCompanyProfile() {
        companyProfileRepository.save(CompanyProfile.builder()
                .companyName("Amit Traders India")
                .tagline("Premium Genuine Leather Manufacturing — Mumbai [SAMPLE]")
                .description("""
                        Amit Traders India is a Mumbai-based manufacturer of premium genuine leather goods \
                        for global B2B buyers. We craft wallets, belts, bags, jackets, and custom leather \
                        accessories with disciplined quality control and flexible OEM/ODM programmes. [SAMPLE]
                        """)
                .history("""
                        Founded in Mumbai's leather trade corridor, Amit Traders India grew from a small \
                        workshop into a full-scale manufacturing partner serving retailers, brands, and \
                        distributors worldwide. [SAMPLE]
                        """)
                .mission("Deliver authentic leather craftsmanship at export-ready scale with transparent MOQs and reliable lead times. [SAMPLE]")
                .vision("Become the trusted leather manufacturing partner for discerning brands across continents. [SAMPLE]")
                .phone("+91 22 4000 0000")
                .email("sales@amittraders.com")
                .address("Leather Market Complex, Dharavi Road")
                .city("Mumbai")
                .state("Maharashtra")
                .country("India")
                .website("https://amittraders.com")
                .linkedin("https://linkedin.com/company/amit-traders-india")
                .instagram("https://instagram.com/amittradersindia")
                .heroTitle("Genuine Leather. Manufactured in Mumbai.")
                .heroSubtitle("B2B OEM & ODM leather products with a 50-piece minimum order — built for brands that demand quality.")
                .heroImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&q=80")
                .heroCtaPrimary("Request a Quote")
                .heroCtaSecondary("Browse Products")
                .aboutImageUrl("https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=1200&q=80")
                .whyChooseUsJson("""
                        [
                          {"title":"Genuine Leather Only","description":"Full-grain and top-grain leather sourced for durability and hand-feel.","icon":"leather"},
                          {"title":"Export-Ready QC","description":"Inline and final inspections aligned with international buyer standards.","icon":"shield"},
                          {"title":"Custom Branding","description":"Debossing, foil stamping, and private-label packaging available.","icon":"brand"},
                          {"title":"Flexible MOQ","description":"Start from 50 pieces with scalable production capacity.","icon":"scale"}
                        ]
                        """)
                .manufacturingStepsJson("""
                        [
                          {"step":1,"title":"Brief & Sampling","description":"Share specs, materials, and branding — we cut samples for approval."},
                          {"step":2,"title":"Material Selection","description":"Choose leather type, thickness, colour, and hardware."},
                          {"step":3,"title":"Production","description":"Skilled artisans cut, stitch, and finish under QC checkpoints."},
                          {"step":4,"title":"Pack & Ship","description":"Export packaging, documentation, and global logistics support."}
                        ]
                        """)
                .customManufacturingTitle("Custom Leather Manufacturing")
                .customManufacturingDescription("From concept sketches to container-ready cartons — OEM and ODM programmes tailored to your brand. [SAMPLE]")
                .customManufacturingFeaturesJson("""
                        ["Private label & branding","Material & colour matching","Prototype sampling","Bulk production scaling","Export documentation"]
                        """)
                .ctaTitle("Ready to source premium leather?")
                .ctaSubtitle("Tell us about your product needs — our Mumbai team responds within one business day. [SAMPLE]")
                .build());
    }

    private ProductCategory[] seedCategories() {
        String[][] data = {
                {"Wallets", "wallets", "Genuine leather wallets for men and women — bifolds, trifolds, and card holders.", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"},
                {"Belts", "belts", "Classic and contemporary leather belts with solid hardware options.", "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80"},
                {"Bags", "bags", "Laptop bags, messengers, totes, and travel companions in full-grain leather.", "https://images.unsplash.com/photo-1548036328-c9fa89d128ac?w=800&q=80"},
                {"Jackets", "jackets", "Tailored leather jackets crafted for retail and private-label programmes.", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"},
                {"Accessories", "accessories", "Key fobs, card sleeves, passport covers, and small leather goods.", "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"},
                {"Office & Desk", "office-desk", "Desk pads, organisers, and executive leather stationery.", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"},
                {"Travel", "travel", "Weekenders, toiletry kits, and travel organisers built for the road.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"}
        };

        ProductCategory[] categories = new ProductCategory[data.length];
        for (int i = 0; i < data.length; i++) {
            categories[i] = categoryRepository.save(ProductCategory.builder()
                    .name(data[i][0])
                    .slug(data[i][1])
                    .description(data[i][2] + " [SAMPLE]")
                    .imageUrl(data[i][3])
                    .displayOrder(i + 1)
                    .active(true)
                    .build());
        }
        return categories;
    }

    private void seedProducts(ProductCategory[] categories) {
        record SeedProduct(int categoryIndex, String name, String shortDesc, String leatherType,
                           String colors, boolean featured, String image) {
        }

        SeedProduct[] products = {
                new SeedProduct(0, "Classic Bifold Wallet", "Slim bifold with RFID lining and 8 card slots.", "Full-grain cowhide", "Brown, Black, Cognac", true,
                        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&q=80"),
                new SeedProduct(0, "Minimal Card Holder", "Four-slot card holder for everyday carry.", "Top-grain leather", "Black, Tan", false,
                        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&q=80"),
                new SeedProduct(0, "Trifold Executive Wallet", "Spacious trifold with ID window and coin pocket.", "Full-grain buffalo", "Dark Brown", true,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80"),
                new SeedProduct(1, "Heritage Dress Belt", "35mm dress belt with brushed buckle options.", "Full-grain cowhide", "Black, Brown", true,
                        "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=1000&q=80"),
                new SeedProduct(1, "Casual Reversible Belt", "Reversible black/brown belt for versatile wear.", "Top-grain leather", "Black/Brown", false,
                        "https://images.unsplash.com/photo-1661956602119-399196426a0d?w=1000&q=80"),
                new SeedProduct(2, "Urban Messenger Bag", "Padded laptop compartment messenger for daily commute.", "Full-grain cowhide", "Tan, Olive", true,
                        "https://images.unsplash.com/photo-1548036328-c9fa89d128ac?w=1000&q=80"),
                new SeedProduct(2, "Structured Tote", "Open tote with interior zip pocket for work and travel.", "Top-grain leather", "Cognac, Black", false,
                        "https://images.unsplash.com/photo-1590874103328-eac38a67437e?w=1000&q=80"),
                new SeedProduct(2, "Laptop Briefcase", "Executive briefcase with dual compartments.", "Full-grain cowhide", "Black, Espresso", true,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80"),
                new SeedProduct(3, "Cafe Racer Jacket", "Classic cafe racer silhouette with quilted lining.", "Genuine lambskin", "Black, Brown", true,
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=80"),
                new SeedProduct(3, "Biker Style Jacket", "Asymmetric zip biker jacket with hardware accents.", "Cowhide leather", "Black", false,
                        "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1000&q=80"),
                new SeedProduct(4, "Passport Cover", "Embossable passport cover with card slots.", "Top-grain leather", "Navy, Tan, Black", false,
                        "https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=1000&q=80"),
                new SeedProduct(4, "Key Fob Duo", "Matched key fobs for retail gift sets.", "Full-grain leather", "Assorted", false,
                        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&q=80"),
                new SeedProduct(5, "Executive Desk Pad", "Large desk pad with stitched edges.", "Full-grain cowhide", "Cognac, Black", false,
                        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&q=80"),
                new SeedProduct(6, "Weekender Duffel", "Soft-sided leather duffel for short trips.", "Full-grain buffalo", "Brown, Olive", true,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80")
        };

        for (SeedProduct sp : products) {
            ProductCategory category = categories[sp.categoryIndex()];
            Product product = Product.builder()
                    .category(category)
                    .name(sp.name())
                    .slug(SlugUtil.toSlug(sp.name()))
                    .shortDescription(sp.shortDesc() + " [SAMPLE]")
                    .description(sp.shortDesc()
                            + " Manufactured by Amit Traders India in Mumbai with export-ready finishing. "
                            + "Custom branding and colour matching available on MOQ programmes. [SAMPLE]")
                    .material("Genuine leather")
                    .leatherType(sp.leatherType())
                    .colors(sp.colors())
                    .dimensions("Varies by size chart")
                    .customization("Debossing, foil stamping, custom stitching")
                    .branding("Private label packaging available")
                    .manufacturingInfo("Made in Mumbai, India — SAMPLE catalogue item")
                    .minimumOrderQuantity(50)
                    .featured(sp.featured())
                    .active(true)
                    .build();

            product.addImage(ProductImage.builder()
                    .imageUrl(sp.image())
                    .altText(sp.name() + " — sample image")
                    .displayOrder(0)
                    .build());

            productRepository.save(product);
        }
    }

    private void seedClients() {
        String[][] clients = {
                {"Nordic Retail Collective", "https://images.unsplash.com/photo-1560179707-f14b95ef451e?w=400&q=80", "European lifestyle retailer [SAMPLE]"},
                {"Pacific Outfitters", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80", "APAC outdoor & travel brand [SAMPLE]"},
                {"Heritage Goods Co.", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", "US private-label accessories house [SAMPLE]"},
                {"Urban Form Studio", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80", "Design-led menswear label [SAMPLE]"},
                {"Atlas Travel Brands", "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=400&q=80", "Travel goods distributor [SAMPLE]"}
        };
        for (int i = 0; i < clients.length; i++) {
            clientRepository.save(Client.builder()
                    .companyName(clients[i][0])
                    .logoUrl(clients[i][1])
                    .description(clients[i][2])
                    .displayOrder(i + 1)
                    .active(true)
                    .build());
        }
    }

    private void seedEnquiries() {
        enquiryRepository.save(Enquiry.builder()
                .fullName("Sarah Mitchell")
                .companyName("Nordic Retail Collective")
                .email("sarah@nordicretail.example")
                .phone("+46 70 000 0000")
                .country("Sweden")
                .city("Stockholm")
                .website("https://nordicretail.example")
                .productType("EXISTING")
                .productCategory("Wallets")
                .productName("Classic Bifold Wallet")
                .quantity(200)
                .leatherType("Full-grain cowhide")
                .preferredColor("Cognac")
                .customizationRequirements("Deboss logo on interior")
                .brandingRequirements("Custom hang tags")
                .message("Looking for Autumn wholesale programme. [SAMPLE]")
                .status(EnquiryStatus.NEW)
                .build());

        enquiryRepository.save(Enquiry.builder()
                .fullName("James Okonkwo")
                .companyName("Pacific Outfitters")
                .email("james@pacificoutfitters.example")
                .phone("+61 400 000 000")
                .country("Australia")
                .city("Sydney")
                .productType("CUSTOM")
                .productCategory("Bags")
                .productName("Custom laptop messenger")
                .quantity(100)
                .leatherType("Top-grain")
                .preferredColor("Olive")
                .customizationRequirements("Padded 15\" sleeve, magnetic flap")
                .brandingRequirements("Metal logo plate")
                .message("Need samples before bulk. [SAMPLE]")
                .status(EnquiryStatus.CONTACTED)
                .build());

        enquiryRepository.save(Enquiry.builder()
                .fullName("Elena Rossi")
                .companyName("Heritage Goods Co.")
                .email("elena@heritagegoods.example")
                .phone("+1 212 555 0100")
                .country("USA")
                .city("New York")
                .productType("EXISTING")
                .productCategory("Belts")
                .productName("Heritage Dress Belt")
                .quantity(500)
                .leatherType("Full-grain cowhide")
                .preferredColor("Black")
                .message("Reorder interest for Q4. [SAMPLE]")
                .status(EnquiryStatus.QUOTED)
                .build());

        enquiryRepository.save(Enquiry.builder()
                .fullName("Kenji Tanaka")
                .companyName("Urban Form Studio")
                .email("kenji@urbanform.example")
                .phone("+81 90 0000 0000")
                .country("Japan")
                .city("Tokyo")
                .productType("CUSTOM")
                .productCategory("Accessories")
                .productName("Gift set — passport + card holder")
                .quantity(150)
                .leatherType("Lambskin")
                .preferredColor("Navy")
                .brandingRequirements("Foil stamp in gold")
                .message("Corporate gifting programme. [SAMPLE]")
                .status(EnquiryStatus.IN_PROGRESS)
                .build());
    }
}
