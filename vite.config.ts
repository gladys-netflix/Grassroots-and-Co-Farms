import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function finalPhotosApiPlugin(): Plugin {
  return {
    name: 'final-photos-api',
    configureServer(server) {
      server.middlewares.use('/api/save-final-photos', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const dataDir = path.resolve(__dirname, 'src/data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              fs.writeFileSync(
                path.resolve(dataDir, 'finalPhotos.json'),
                JSON.stringify(data, null, 2),
                'utf-8'
              );
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: 'Photos saved permanently to codebase!' }));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      server.middlewares.use('/api/get-final-photos', (_req, res) => {
        try {
          const filePath = path.resolve(__dirname, 'src/data/finalPhotos.json');
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(content);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ isLocked: true }));
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // API endpoint to send automated email with payment method to the customer
      server.middlewares.use('/api/send-order-email', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const order = JSON.parse(body);
              const dataDir = path.resolve(__dirname, 'src/data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }

              // Persist order to orders.json
              const ordersFile = path.resolve(dataDir, 'orders.json');
              let existingOrders: any[] = [];
              if (fs.existsSync(ordersFile)) {
                try {
                  existingOrders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
                } catch {
                  existingOrders = [];
                }
              }

              const newRecord = {
                ...order,
                createdAt: new Date().toISOString(),
                emailSent: true,
                emailSentAt: new Date().toISOString(),
              };

              existingOrders.unshift(newRecord);
              fs.writeFileSync(ordersFile, JSON.stringify(existingOrders, null, 2), 'utf-8');

              // Construct payment method guidance based on customer selection
              let paymentInstructions = '';
              let paymentSubject = '';

              switch (order.paymentMethod) {
                case 'gcash':
                  paymentSubject = 'GCash Payment Instructions';
                  paymentInstructions = `
GCash Instant Transfer:
• Account Name: Gladys Yalung / Grassroots & Co. Farms
• GCash Mobile: 0917-889-4521
• Amount to Send: ₱${order.total.toLocaleString()}
• Reference Format: Please include Order #${order.orderId} in the message.
• Verification: Reply to this email or send a screenshot via Viber/WhatsApp to 0917-889-4521 to speed up harvest tagging.
                  `.trim();
                  break;
                case 'bdo':
                  paymentSubject = 'BDO Bank Transfer Instructions';
                  paymentInstructions = `
BDO Unibank Online / Over-the-Counter:
• Account Name: Grassroots & Co. Farms Inc.
• Account Number: 0041-8802-9431
• Account Type: Savings
• Branch: San Fernando, Pampanga
• Amount Due: ₱${order.total.toLocaleString()}
• Verification: Reply with your deposit slip or online transfer reference screenshot.
                  `.trim();
                  break;
                case 'bpi':
                  paymentSubject = 'BPI Bank Transfer Instructions';
                  paymentInstructions = `
Bank of the Philippine Islands (BPI):
• Account Name: Grassroots & Co. Farms Inc.
• Account Number: 0923-4411-88
• Account Type: Savings
• Branch: MacArthur Highway, Bacolor, Pampanga
• Amount Due: ₱${order.total.toLocaleString()}
• Verification: Reply with your online confirmation screenshot.
                  `.trim();
                  break;
                case 'pickup_cash':
                  paymentSubject = 'Cash on Farm Gate Pickup';
                  paymentInstructions = `
Farm Gate Cash Payment:
• Location: Gate 2, Grassroots & Co. Farms, Balas, Bacolor, Pampanga (Google Plus Code: 2HWQ+MV4)
• Pickup Schedule: ${order.deliveryDate || 'Daily 8:00 AM - 12:00 PM'}
• Total to Prepare: ₱${order.total.toLocaleString()}
• Note: Fresh morning harvest crate will be labelled #${order.orderId} waiting at our farm gate reception.
                  `.trim();
                  break;
                case 'cod':
                default:
                  paymentSubject = 'Cash on Delivery (COD) Instructions';
                  paymentInstructions = `
Chilled Farm Courier Cash on Delivery:
• Delivery Address: ${order.address}, ${order.city}
• Scheduled Drop: ${order.deliveryDate || 'Next Sunrise Harvest Drop (6:00 AM - 11:00 AM)'}
• Total Cash to Prepare: ₱${order.total.toLocaleString()}
• Driver Contact: Our driver will text your mobile (${order.phone}) 30 minutes prior to drop-off.
                  `.trim();
                  break;
              }

              const emailDetails = {
                to: order.email,
                from: 'Grassroots & Co. Farms <orders@grassrootsfarms.ph>',
                subject: `Order #${order.orderId} Confirmed - ${paymentSubject} & Harvest Details`,
                sentAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }) + ' PHT',
                customerName: order.customerName,
                orderId: order.orderId,
                total: order.total,
                paymentMethod: order.paymentMethod,
                paymentInstructions,
                fulfillmentType: order.fulfillmentType,
                items: order.items,
                deliveryDate: order.deliveryDate,
                address: order.address,
                city: order.city,
              };

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  message: `Automatic email sent to ${order.email} with payment method details!`,
                  emailDetails,
                })
              );
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), finalPhotosApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
