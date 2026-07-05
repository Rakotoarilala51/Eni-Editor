/** Message affiché quand aucun fichier n'est ouvert dans l'éditeur. */
export default function Watermark() {
  return (
    <div className="watermark" id="watermark">
      <b>Aucun éditeur ouvert</b>
      <div>Sélectionnez un fichier dans l&apos;EXPLORATEUR pour commencer</div>
    </div>
  );
}
