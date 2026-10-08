// Registry: section name in guidelines/website-sections.md → preview component and anatomy notes.
// Add a file here when a section is added to the guidelines; the docs build warns about sections without a preview.
import type { ComponentType } from 'react';
import * as HeaderNavigation from './HeaderNavigation';
import * as Footer from './Footer';
import * as HeroSection from './HeroSection';
import * as FeaturesSection from './FeaturesSection';
import * as FeatureSplitSection from './FeatureSplitSection';
import * as BentoSection from './BentoSection';
import * as LogoCloud from './LogoCloud';
import * as Testimonial from './Testimonial';
import * as TestimonialsGrid from './TestimonialsGrid';
import * as MetricsSection from './MetricsSection';
import * as PricingCard from './PricingCard';
import * as PricingSection from './PricingSection';
import * as FaqItem from './FaqItem';
import * as FaqSection from './FaqSection';
import * as CtaSection from './CtaSection';
import * as NewsletterSection from './NewsletterSection';
import * as BlogCard from './BlogCard';
import * as BlogSection from './BlogSection';
import * as TeamMember from './TeamMember';
import * as TeamSection from './TeamSection';
import * as ContactSection from './ContactSection';
import * as CareersSection from './CareersSection';
import * as ComparisonTableSection from './ComparisonTableSection';
import * as IntegrationsSection from './IntegrationsSection';
import * as NotFoundSection from './NotFoundSection';
import * as BlogPostContent from './BlogPostContent';
import * as ContentSection from './ContentSection';
import * as PressMentions from './PressMentions';
import * as LegalContent from './LegalContent';
import * as AuthSection from './AuthSection';

type Entry = { default: ComponentType; anatomy: string[] };

export const SECTIONS: Record<string, Entry> = {
  'Header navigation': HeaderNavigation,
  Footer,
  'Hero section': HeroSection,
  'Features section': FeaturesSection,
  'Feature split section': FeatureSplitSection,
  'Bento section': BentoSection,
  'Logo cloud': LogoCloud,
  Testimonial,
  'Testimonials grid': TestimonialsGrid,
  'Metrics section': MetricsSection,
  'Pricing card': PricingCard,
  'Pricing section': PricingSection,
  'FAQ item': FaqItem,
  'FAQ section': FaqSection,
  'CTA section': CtaSection,
  'Newsletter section': NewsletterSection,
  'Blog card': BlogCard,
  'Blog section': BlogSection,
  'Team member': TeamMember,
  'Team section': TeamSection,
  'Contact section': ContactSection,
  'Careers section': CareersSection,
  'Comparison table section': ComparisonTableSection,
  'Integrations section': IntegrationsSection,
  '404 section': NotFoundSection,
  'Blog post content': BlogPostContent,
  'Content section': ContentSection,
  'Press mentions': PressMentions,
  'Legal content': LegalContent,
  'Auth section': AuthSection,
};
