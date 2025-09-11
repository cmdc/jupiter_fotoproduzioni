"use client";

import { ImageProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

interface BricksMasonryProps {
  images: ImageProps[];
}

export default function BricksMasonry({ images }: BricksMasonryProps) {
  // Generate varied heights for organic look
  const getRandomHeight = (index: number) => {
    const heights = [300, 200, 400, 250, 350, 180, 450, 220, 380, 280, 320, 500, 160, 420];
    return heights[index % heights.length];
  };

  // Split images into rows of 3-4 images each
  const createRows = (imageArray: ImageProps[]) => {
    const rows: ImageProps[][] = [];
    let currentRow: ImageProps[] = [];
    
    imageArray.forEach((image, index) => {
      currentRow.push(image);
      
      // Create new row every 3-4 images (alternate between 3 and 4)
      const rowSize = (Math.floor(index / 4) % 2 === 0) ? 3 : 4;
      
      if (currentRow.length >= rowSize) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    // Add remaining images as last row
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    
    return rows;
  };

  const imageRows = createRows(images);

  return (
    <div className="w-full">
      {/* Mobile: Simple vertical layout */}
      <div className="md:hidden space-y-1">
        {images.map((image, index) => (
          <Link key={image.idc} href={`/photography/${image.idc}`}>
            <div 
              className="relative overflow-hidden hover:scale-[1.01] transition-transform duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={0}
                height={0}
                className="w-full h-auto object-contain"
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL}
                priority={index < 4}
                sizes="100vw"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-medium text-sm truncate">{image.alt}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: Row-based layout with organic masonry within each row */}
      <div className="hidden md:block space-y-2">
        {imageRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="flex gap-1"
          >
            {row.map((image, imageIndex) => {
              const globalIndex = imageRows.slice(0, rowIndex).flat().length + imageIndex;
              const height = getRandomHeight(globalIndex);
              const widthPercentage = 100 / row.length; // Equal width distribution
              
              return (
                <Link 
                  key={image.idc} 
                  href={`/photography/${image.idc}`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  <div 
                    className="relative overflow-hidden hover:scale-[1.005] transition-transform duration-300 group"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={0}
                      height={0}
                      className="w-full h-auto object-contain"
                      placeholder={image.blurDataURL ? "blur" : "empty"}
                      blurDataURL={image.blurDataURL}
                      priority={globalIndex < 8}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 text-white">
                        <h3 className="font-medium text-sm truncate">{image.alt?.replace(/\.\w+$/, '')}</h3>
                        {image.date && (
                          <p className="text-xs opacity-75 mt-1">{image.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}