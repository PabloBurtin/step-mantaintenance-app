import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath} from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = join(__dirname, '../assets/logo-step.png');
const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendResetPasswordEmail = async (toEmail, resetUrl) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: 'Recuperación de contraseña',
        html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #21252b; padding: 24px; text-align: center;">
                    <img src="${logoBase64}" alt="Step Servicios" style="height: 60px;" />
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #21252b;">Recuperá tu contraseña</h2>
                    <p style= "color: #444;">Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                    <p style= "color: #444;">Hacé click en el botón para crear una nueva contraseña. El link es válido por <strong>1 hora</strong>.</p>
                    <div style= "text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #caa661; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                            Restablecer contraseña
                        </a>
                    </div>
                    <p style="color: #888; font-size: 13px;">Si no solicitaste esto, ignorá este correo.</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
                    Step Servicios SA — www.stepservicios.com
                </div>
            </div>
        ` 
    });
};

export const sendVerificationEmail = async (toEmail, verificationUrl) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: 'Confirmá tu cuenta - Step Servicios SA',
        html: `
            <div style="font-family: sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #21252b; padding: 24px; text-align: center;">
                    <img src="${logoBase64}" alt="Step Servicios SA" style="height: 60px;" />
                </div>
                <div style="padding: 32px;">
                    <h2 style="color: #21252b; margin-top: 0;">Confirmá tu cuenta</h2>
                    <p style="color: #444;">Gracias por registrarte. Hacé click en el botón para activar tu cuenta.</p>
                    <p style="color: #444;">El link es válido por <strong>24 horas</strong>.</p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 28px; background-color: #caa661; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">
                            Confirmar cuenta
                        </a>
                    </div>
                    <p style="color: #999; font-size: 13px;">Si no creaste esta cuenta, podés ignorar este correo.</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
                    Step Servicios SA - www.stepservicios.com
                </div>
            </div>
        `
    }) 
}