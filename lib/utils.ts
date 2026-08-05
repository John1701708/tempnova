import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DOMAINS = [
  "tempnova.io","maildrop.cc","guerrillamail.net","10minutemail.com",
  "throwawaymail.com","tempmailaddress.com","burnermail.io","fakemail.net",
  "mailinator.com","yopmail.com","getairmail.com","tempail.com",
  "mailnesia.com","sharklasers.com","spam4.me","trashmail.net",
  "mytemp.email","mailcatch.com","jetable.org","mohmal.com",
  "tempinbox.com","discard.email","spamgourmet.com","boun.cr",
  "mailtothis.com","anonbox.net","tempmailo.com","disposableemail.org",
  "emailondeck.com","fakeinbox.com","getnada.com","inboxkitten.com",
  "luxusmail.org","mailpoof.com","tempm.com"
];

const ADJECTIVES = [
  "swift","bright","cool","dark","fast","quiet","wild","calm",
  "bold","keen","sharp","grand","noble","pure","vast","deep",
  "true","fair","firm","safe","free",
];

const NOUNS = [
  "eagle","tiger","wolf","falcon","raven","hawk","bear","lion",
  "fox","deer","owl","dove","crane","swan","lynx","orca","puma",
  "cobra","viper","shark","whale","moose","elk","goat","duck",
  "hare","mole","toad","newt","crow","ibis","jay","kite",
];

export function generateTempEmail(): { email: string; domain: string } {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
  return { email: `${adj}${noun}${num}@${domain}`, domain };
}

export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}
