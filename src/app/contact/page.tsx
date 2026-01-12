import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | AutoIPTC",
  description:
    "AutoIPTCに関するご質問、ご意見、ご要望などをお気軽にお問い合わせください。サービスの改善にご協力をお願いいたします。",
};

export default function ContactPage() {
  return <ContactForm />;
}
