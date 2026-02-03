# WhatsApp Bot QR Code Connection Instructions

To connect your WhatsApp account to the bot:

1. Deploy and start the bot. In the logs, you will see a line like:
   
   `Scan this QR code with WhatsApp:`
   followed by a long string of characters.

2. Copy the entire QR code string from the logs.

3. Go to [https://www.qr-code-generator.com/](https://www.qr-code-generator.com/)

4. Paste the QR code string into the "Enter your text" box.

5. The website will generate a QR code image instantly.

6. Open WhatsApp on your phone, go to **Linked Devices** > **Link a device**, and scan the generated QR code.

Your bot will now be authenticated and ready to use!

---

**Tip:** You only need to scan the QR code again if the bot is redeployed without session persistence or the session expires.
