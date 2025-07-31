import Link from "next/link";
import React from "react";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image"; 

interface Book {
  id: string;
  title: string;
  genre: string;
  color: string;
  cover: string;
  isLoanedBook?: boolean;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Book) => {
  const liClassName = isLoanedBook ? "xs:w-52 w-full" : "";
  const linkClassName = isLoanedBook ? "w-full flex flex-col items-center" : "";
  const infoContainerClass = `mt-4 ${
    !isLoanedBook ? "xs:max-w-40 max-w-28" : ""
  }`;

  return (
    <li className={liClassName}>
      <Link href={`/books/${id}`} className={linkClassName}>
        <BookCover coverColor={coverColor} coverUrl={coverUrl} />
        <div className={infoContainerClass}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>

        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned flex items-center gap-2">
              <Image
                src="/icons/calender.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">11 days left to return</p>
            </div>
            <Button className="book-btn mt-2">Download receipt</Button>
          </div>
        )}
      </Link>
    </li>
  );
};

export default BookCard;
