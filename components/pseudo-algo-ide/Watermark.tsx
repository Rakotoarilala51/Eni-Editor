/** Message affiché quand aucun fichier n'est ouvert dans l'éditeur. */
export default function Watermark() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-2.5 text-[13px] text-[#5a5a5a]"
      id="watermark"
    >
      <b className="font-semibold text-[#8a8a8a]">Aucun éditeur ouvert</b>
      <div>Sélectionnez un fichier dans l&apos;EXPLORATEUR pour commencer</div>
    </div>
  );
}