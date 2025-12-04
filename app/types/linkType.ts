export type LinkItem = {
  id: string;
  title: string;
  href: string;
  icon:
    | "portfolio"
    | "instagram"
    | "github"
    | "linkedin"
    | "email";
  description?: string;
  badge?: string;
};