import './globals.css';
export const metadata = {
  title: 'ResumeMatch - JD Matching Tool',
  description: 'Match your resume to job descriptions instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}