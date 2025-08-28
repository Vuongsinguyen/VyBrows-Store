const fs = require('fs');
const path = require('path');

function analyzeProducts() {
  const filePath = path.join(__dirname, 'data/products.json');

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

    console.log(`📊 Tổng số sản phẩm: ${products.length}\n`);

    const issues = {
      missingFields: [],
      inconsistentIds: [],
      imageIssues: [],
      priceIssues: [],
      variantIssues: [],
      seoIssues: []
    };

    // Kiểm tra từng sản phẩm
    products.forEach((product, index) => {
      const productNum = index + 1;

      // 1. Kiểm tra các trường bắt buộc
      const requiredFields = ['id', 'handle', 'title', 'description', 'price', 'images', 'featuredImage', 'seo', 'priceRange'];
      const missingFields = requiredFields.filter(field => !product[field]);

      if (missingFields.length > 0) {
        issues.missingFields.push({
          product: productNum,
          id: product.id,
          title: product.title,
          missing: missingFields
        });
      }

      // 2. Kiểm tra ID có liên tục không
      const expectedId = (index + 1).toString();
      if (product.id !== expectedId) {
        issues.inconsistentIds.push({
          product: productNum,
          expectedId,
          actualId: product.id,
          title: product.title
        });
      }

      // 3. Kiểm tra images
      if (!product.images || product.images.length === 0) {
        issues.imageIssues.push({
          product: productNum,
          id: product.id,
          title: product.title,
          issue: 'Không có images'
        });
      } else {
        // Kiểm tra format URL
        product.images.forEach((image, imgIndex) => {
          if (!image.url || !image.url.startsWith('/images/') || !image.url.endsWith('.png')) {
            issues.imageIssues.push({
              product: productNum,
              id: product.id,
              title: product.title,
              issue: `Image ${imgIndex + 1} có URL không đúng format: ${image.url}`
            });
          }
        });
      }

      // 4. Kiểm tra featuredImage
      if (!product.featuredImage || !product.featuredImage.url) {
        issues.imageIssues.push({
          product: productNum,
          id: product.id,
          title: product.title,
          issue: 'Không có featuredImage'
        });
      }

      // 5. Kiểm tra price consistency
      if (product.price && product.priceRange) {
        const priceStr = product.price.toString();
        const minPrice = product.priceRange.minVariantPrice?.amount;
        const maxPrice = product.priceRange.maxVariantPrice?.amount;

        if (priceStr !== minPrice || priceStr !== maxPrice) {
          issues.priceIssues.push({
            product: productNum,
            id: product.id,
            title: product.title,
            price: priceStr,
            minPrice,
            maxPrice
          });
        }
      }

      // 6. Kiểm tra variants
      if (!product.variants || product.variants.length === 0) {
        issues.variantIssues.push({
          product: productNum,
          id: product.id,
          title: product.title,
          issue: 'Không có variants'
        });
      } else {
        product.variants.forEach((variant, varIndex) => {
          if (!variant.id || !variant.price) {
            issues.variantIssues.push({
              product: productNum,
              id: product.id,
              title: product.title,
              issue: `Variant ${varIndex + 1} thiếu id hoặc price`
            });
          }
        });
      }

      // 7. Kiểm tra SEO
      if (!product.seo || !product.seo.title || !product.seo.description) {
        issues.seoIssues.push({
          product: productNum,
          id: product.id,
          title: product.title,
          issue: 'Thiếu thông tin SEO'
        });
      }
    });

    // Hiển thị kết quả
    console.log('🔍 KẾT QUẢ PHÂN TÍCH:\n');

    if (issues.missingFields.length > 0) {
      console.log(`❌ ${issues.missingFields.length} sản phẩm thiếu trường bắt buộc:`);
      issues.missingFields.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product} (${issue.title}): thiếu ${issue.missing.join(', ')}`);
      });
      console.log('');
    }

    if (issues.inconsistentIds.length > 0) {
      console.log(`⚠️  ${issues.inconsistentIds.length} sản phẩm có ID không liên tục:`);
      issues.inconsistentIds.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product}: expected ${issue.expectedId}, got ${issue.actualId} (${issue.title})`);
      });
      console.log('');
    }

    if (issues.imageIssues.length > 0) {
      console.log(`🖼️  ${issues.imageIssues.length} vấn đề với hình ảnh:`);
      issues.imageIssues.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product} (${issue.title}): ${issue.issue}`);
      });
      console.log('');
    }

    if (issues.priceIssues.length > 0) {
      console.log(`💰 ${issues.priceIssues.length} vấn đề với giá:`);
      issues.priceIssues.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product} (${issue.title}): price=${issue.price}, min=${issue.minPrice}, max=${issue.maxPrice}`);
      });
      console.log('');
    }

    if (issues.variantIssues.length > 0) {
      console.log(`🔄 ${issues.variantIssues.length} vấn đề với variants:`);
      issues.variantIssues.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product} (${issue.title}): ${issue.issue}`);
      });
      console.log('');
    }

    if (issues.seoIssues.length > 0) {
      console.log(`🔍 ${issues.seoIssues.length} vấn đề với SEO:`);
      issues.seoIssues.forEach(issue => {
        console.log(`  - Sản phẩm ${issue.product} (${issue.title}): ${issue.issue}`);
      });
      console.log('');
    }

    const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);

    if (totalIssues === 0) {
      console.log('✅ TẤT CẢ SẢN PHẨM ĐỀU ĐỒNG BỘ!');
    } else {
      console.log(`⚠️  Tìm thấy ${totalIssues} vấn đề cần khắc phục.`);
    }

  } catch (error) {
    console.error('❌ Lỗi khi đọc file:', error.message);
  }
}

analyzeProducts();
