import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { useImage } from "react-image";
import { useReadLocalStorage } from "usehooks-ts";

type AlbumArtProps = {
  href: string;
  src: string;
  disableFocus?: boolean;
} & ComponentPropsWithoutRef<typeof Image>;

const AlbumArt = ({ href, alt, src, disableFocus, ...rest }: AlbumArtProps) => {
  const { src: loadedSrc } = useImage({ srcList: src });
  const useWebPlayer = useReadLocalStorage("useWebPlayer");

  return (
    <a
      tw="relative block bg-black rounded-sm shadow-3xl"
      css="font-size: 0"
      href={href}
      target={useWebPlayer ? "_blank" : undefined}
      rel="noreferrer"
      tabIndex={disableFocus ? -1 : undefined}
    >
      <Image src={loadedSrc!} alt={alt} width={640} height={640} {...rest} />
      <div tw="absolute inset-0 shadow-inset" />
    </a>
  );
};

export default AlbumArt;
