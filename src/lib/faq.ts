// FAQ — answers verbatim.

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faq: FaqEntry[] = [
  {
    question: "Do I really own it?",
    answer:
      "Yes — domain, code, hosting, profile, ad account, data, all registered to you. There is nothing to cancel because there is no subscription on the build.",
  },
  {
    question: "What does it cost to run?",
    answer:
      "Hosting is free at the traffic these sites see. The only recurring cost is the domain — roughly $20 a year — unless you choose a Watch plan.",
  },
  {
    question: "Do my leads still reach BoldTrail?",
    answer:
      "Yes. Every form routes through BoldTrail's own Lead Dropbox parser into the account your brokerage already gives you. Nothing new to learn.",
  },
  {
    question: "What if I'd rather not write one cheque?",
    answer:
      "Every build splits across twelve months for about 11% more. You still own everything from launch day; you just owe the balance.",
  },
  {
    question: "What happens if I change brokerages?",
    answer: "Everything comes with you. That is the point of building it in your name.",
  },
  {
    question: "Can you guarantee results?",
    answer:
      "No — and be careful with anyone who does. What I guarantee, in writing, is what gets built and that every account is in your name. The numbers you'll see are Google's, in your own dashboards, not mine.",
  },
  {
    question: "Why is there a minimum for ad management?",
    answer:
      "Because below about $2,000 a month in spend, the cost per lead makes the math indefensible, and I would rather tell you that than take the fee.",
  },
];
