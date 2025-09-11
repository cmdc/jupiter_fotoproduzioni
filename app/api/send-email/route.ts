import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone, eventType, eventDate } =
      await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, email e messaggio sono obbligatori" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Indirizzo email non valido" },
        { status: 400 }
      );
    }

    // Create transporter (configure with your email service)
    const smtpPort = parseInt(process.env.NEXT_SMTP_PORT || "587");
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_SMTP_HOST || "smtp.gmail.com",
      port: smtpPort,
      secure: smtpPort === 465, // true for 465 (SSL), false for other ports (STARTTLS)
      auth: {
        user: process.env.NEXT_SMTP_USER,
        pass: process.env.NEXT_SMTP_PASS,
      },
      // Additional SSL/TLS options for better compatibility
      tls: {
        rejectUnauthorized: false, // Useful for self-signed certificates
      },
    });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #74feff; padding-bottom: 10px;">
          Nuova Richiesta di Contatto - Luigi Bruno Fotografo
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Dettagli Cliente:</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefono:</strong> ${phone}</p>` : ""}
        </div>

        ${
          eventType || eventDate
            ? `
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Dettagli Evento:</h3>
          ${
            eventType
              ? `<p><strong>Tipo di Evento:</strong> ${eventType}</p>`
              : ""
          }
          ${
            eventDate
              ? `<p><strong>Data Evento:</strong> ${new Date(
                  eventDate
                ).toLocaleDateString("it-IT")}</p>`
              : ""
          }
        </div>
        `
            : ""
        }

        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #74feff; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Messaggio:</h3>
          <p style="line-height: 1.6; color: #666;">${message.replace(
            /\n/g,
            "<br>"
          )}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            Questa email è stata inviata dal form di contatto del sito web Luigi Bruno Fotografo
          </p>
        </div>
      </div>
    `;

    const textContent = `
Nuova Richiesta di Contatto - Luigi Bruno Fotografo

DETTAGLI CLIENTE:
Nome: ${name}
Email: ${email}
${phone ? `Telefono: ${phone}` : ""}

${
  eventType || eventDate
    ? `
DETTAGLI EVENTO:
${eventType ? `Tipo di Evento: ${eventType}` : ""}
${
  eventDate
    ? `Data Evento: ${new Date(eventDate).toLocaleDateString("it-IT")}`
    : ""
}
`
    : ""
}

MESSAGGIO:
${message}

---
Questa email è stata inviata dal form di contatto del sito web.
    `;

    // Prepare recipient list
    let recipients = [
      process.env.NEXT_CONTACT_EMAIL || "info@jupiterfoto.it"
    ];
    
    // Add additional recipients if configured
    if (process.env.NEXT_CONTACT_EMAIL_2) {
      recipients.push(process.env.NEXT_CONTACT_EMAIL_2);
    }
    
    // Support comma-separated list in NEXT_CONTACT_EMAILS
    if (process.env.NEXT_CONTACT_EMAILS) {
      const additionalEmails = process.env.NEXT_CONTACT_EMAILS
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      recipients = [...recipients, ...additionalEmails];
    }
    
    // Remove duplicates
    recipients = Array.from(new Set(recipients));

    // Prepare BCC list
    let bccRecipients: string[] = [];
    
    // Support BCC recipients from environment variables
    if (process.env.NEXT_CONTACT_BCC) {
      const bccEmails = process.env.NEXT_CONTACT_BCC
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      bccRecipients = Array.from(new Set(bccEmails)); // Remove duplicates
    }

    // Send email
    const emailOptions: nodemailer.SendMailOptions = {
      from: `"Sito Web Luigi Bruno" <${process.env.NEXT_SMTP_USER}>`,
      to: recipients,
      subject: `Nuova richiesta di contatto da ${name}`,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    };

    // Add BCC only if there are recipients
    if (bccRecipients.length > 0) {
      emailOptions.bcc = bccRecipients;
    }

    const info = await transporter.sendMail(emailOptions);

    console.log("Email sent: %s", info.messageId);

    // Send confirmation email to client
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #74feff; padding-bottom: 10px;">
          Grazie per averci contattato!
        </h2>
        
        <p style="line-height: 1.6; color: #666;">
          Ciao <strong>${name}</strong>,
        </p>
        
        <p style="line-height: 1.6; color: #666;">
          Grazie per aver scelto Luigi Bruno Fotografo per il tuo evento speciale. 
          Ho ricevuto la tua richiesta e ti risponderò entro 24 ore.
        </p>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Riepilogo della tua richiesta:</h3>
          ${
            eventType
              ? `<p><strong>Tipo di Evento:</strong> ${eventType}</p>`
              : ""
          }
          ${
            eventDate
              ? `<p><strong>Data Evento:</strong> ${new Date(
                  eventDate
                ).toLocaleDateString("it-IT")}</p>`
              : ""
          }
          <p><strong>Messaggio:</strong></p>
          <p style="font-style: italic; color: #888;">${message}</p>
        </div>

        <p style="line-height: 1.6; color: #666;">
          Nel frattempo, ti invito a visitare il mio portfolio per scoprire altri lavori.
        </p>

        <div style="margin-top: 30px; padding: 20px; background-color: #74feff; color: white; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Luigi Bruno Fotografo</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Matrimoni e Eventi in Basilicata</p>
        </div>
      </div>
    `;

    // Send confirmation to client
    await transporter.sendMail({
      from: `"Luigi Bruno Fotografo" <${process.env.NEXT_SMTP_USER}>`,
      to: email,
      subject: "Conferma ricezione - Luigi Bruno Fotografo",
      html: confirmationHtml,
    });

    return NextResponse.json({
      message: "Email inviata con successo! Ti risponderemo entro 24 ore.",
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Errore nell'invio dell'email. Riprova più tardi." },
      { status: 500 }
    );
  }
}
