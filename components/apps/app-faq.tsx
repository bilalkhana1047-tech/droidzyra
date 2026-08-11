import type { App } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function AppFAQ({ app }: { app: App }) {
  const faqs = [
    {
      q: `What is ${app.name}?`,
      a: app.description ?? `${app.name} is an Android app by ${app.developer}.`,
    },
    {
      q: `Who develops ${app.name}?`,
      a: `${app.name} is developed by ${app.developer}. The package name is ${app.package_name}.`,
    },
    {
      q: `Is ${app.name} free to download?`,
      a: 'DroidZyra directs you to the official source for download. Pricing and availability are determined by the developer and the official distribution channel.',
    },
    {
      q: `Does DroidZyra host APK files for ${app.name}?`,
      a: 'No. DroidZyra does not host, redistribute or link to pirated, cracked or modded APK files. We provide links to official and authorized sources only.',
    },
    {
      q: `How do I check if ${app.name} works on my Android version?`,
      a: `Use the DroidZyra Compatibility Finder or visit the ${app.name} detail page to see minimum Android requirements and compatible versions.`,
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
