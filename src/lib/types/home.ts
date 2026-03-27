export interface MockProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  buttonPrimary: {
    text: string;
    href: string;
  };
  buttonSecondary: {
    text: string;
    href: string;
  };
}
