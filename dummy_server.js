const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Bouncer
const requireAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === 'admin' && password === 'admin') {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Zabezpieczony Panel"');
    res.status(401).send('Brak dostępu. Odśwież stronę, aby spróbować ponownie.');
};

// --- ROUTES ---

app.post('/api/purchase', (req, res) => {
    const orderData = req.body;

    const timestamp = Date.now();
    const filename = `order-${timestamp}.json`;
    const filePath = path.join(__dirname, 'orders', filename);

    fs.writeFile(filePath, JSON.stringify(orderData, null, 2), (err) => {
        if (err) {
            console.error('Błąd zapisu pliku:', err);
            return res.status(500).json({ message: 'Błąd serwera podczas zapisu zamówienia.' });
        }

        console.log(`Nowe zamówienie zapisane: ${filename}`);

        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Błąd tworzenia konta email:', err);
                return res.status(200).json({ message: 'Zamówienie zapisane (Błąd maila).' });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: account.user, pass: account.pass }
            });

            const message = {
                from: '"Fachowcy Szkołom" <kontakt@fachowcyszkolom.lodz.pl>',
                to: orderData.email,
                subject: 'Potwierdzenie zakupu vouchera - Fachowcy Szkołom',
                html: `
                    <h2>Cześć ${orderData.firstName}!</h2>
                    <p>Dziękujemy za wsparcie łódzkich szkół zawodowych!</p>
                    <p>Twój voucher na usługę jest gotowy. Wybrana metoda płatności to: <strong>${orderData.paymentMethod.toUpperCase()}</strong>.</p>
                    <p>Skontaktujemy się z Tobą wkrótce w celu ustalenia szczegółów realizacji pod numerem: ${orderData.phone}. Również śledź naszego Facbook'a by być na bierząco z postępami akcji</p>
                    <hr>
                    <small>Zespół "Budujemy Przyszłość Lokalnie"</small>
                `
            };

            transporter.sendMail(message, (err, info) => {
                if (err) return console.error('Błąd wysyłania:', err);

                console.log('E-mail wysłany. Podgląd: %s', nodemailer.getTestMessageUrl(info));
            });
        });

        res.status(200).json({ message: 'Zamówienie zapisane pomyślnie!' });
    });
});

app.get('/api/orders', requireAuth, (req, res) => {
    const ordersDir = path.join(__dirname, 'orders');

    if (!fs.existsSync(ordersDir)) {
        return res.json([]);
    }

    fs.readdir(ordersDir, (err, files) => {
        if (err) return res.status(500).json({ message: 'Błąd odczytu folderu' });

        const orders = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(ordersDir, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                return { id: file, ...JSON.parse(fileData) };
            });

        res.json(orders);
    });
});

app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);

    const dir = path.join(__dirname, 'orders');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
});