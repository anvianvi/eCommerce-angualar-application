export type TeamMember = {
  name: string;
  title: string;
  photo: string;
  shortBio: string;
  github: string;
  githubName: string;
};

export const teamList: TeamMember[] = [
  {
    name: 'Miranda Makharashvili',
    title: 'Mentor, Software Engineer',
    photo: 'assets/minion-2.jpg',
    shortBio: 'Inspires a passion for Angular.',
    github: 'https://github.com/mirandamakharashvili',
    githubName: 'mirandamakharashvili',
  },
  {
    name: 'Pavel Viarbitski',
    title: 'Developer',
    photo: 'assets/minion-3.jfif',
    shortBio: 'With passion and love to Angular, crafting this application.',
    github: 'https://github.com/anvianvi',
    githubName: 'anvianvi',
  },
  {
    name: '	Kamil Rogowski',
    title: 'Developer',
    photo: 'assets/minion-1.jpeg',
    shortBio: `Inspired by Angular's potential, breathe life and soul into application.`,
    github: 'https://github.com/kamilmrogowski',
    githubName: 'kamilmrogowski',
  },
];
