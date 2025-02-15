"use client"; // Ensure you're in the client-side context


import { TypewriterEffect } from "@/components/ui/TypewriterEffect";

type UserPortfolioHeaderProps = {
  name: string | null; // name could be string or null
};

const UserPortfolioHeader: React.FC<UserPortfolioHeaderProps> = ({ name }) => {


  return (
    <>

      <header className="relative">
        <div className="flex justify-start p-8">
          <TypewriterEffect
            words={[
              { text: `${name}'s` },
              { text: "Portfolio" },
            ]}
            className="text-3xl md:text-4xl font-semibold text-white"
            cursorClassName="bg-white"
          />
        </div>
      </header>
    </>
  );
};

export default UserPortfolioHeader;
