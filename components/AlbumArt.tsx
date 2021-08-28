import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { useImage } from "react-image";

type AlbumArtProps = {
  href: string;
  src: string;
  disableFocus?: boolean;
} & ComponentPropsWithoutRef<typeof Image>;

const AlbumArt = ({ href, alt, src, disableFocus, ...rest }: AlbumArtProps) => {
  const { src: loadedSrc } = useImage({ srcList: src });

  return (
    <div
      tw="mx-auto mb-8 overflow-hidden bg-black rounded-sm shadow-3xl"
      style={{ width: 640, height: 640 }}
    >
      <a
        tw="relative block"
        href={href}
        tabIndex={disableFocus ? -1 : undefined}
      >
        <Image src={loadedSrc!} alt={alt} width={640} height={640} {...rest} />
        <div tw="absolute inset-0 shadow-inset" />
      </a>
    </div>
  );
};

export default AlbumArt;
