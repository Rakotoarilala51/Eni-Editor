const DEFAULT_ALGO_CONTENT = `écrire("Nouveau programme");`;

/**
 * Crée un nouveau fichier .algo dans la map de fichiers.
 *
 * @param fileName - nom saisi par l'utilisateur (avec ou sans .algo)
 * @param files - map actuelle des fichiers (state)
 * @returns { success, files?, error?, fileName? }
 */
function createAlgoFile(
  fileName: string,
  files: Record<string, string>
): {
  success: boolean;
  files?: Record<string, string>;
  fileName?: string;
  error?: string;
} {
  let name = fileName.trim();

  if (!name) {
    return { success: false, error: "Le nom du fichier est requis." };
  }

  // Ajoute automatiquement l'extension si absente
  if (!name.endsWith(".algo")) {
    name += ".algo";
  }

  // Empêche l'écrasement d'un fichier existant (ex: README.md)
  if (files[name] !== undefined) {
    return { success: false, error: "Un fichier avec ce nom existe déjà." };
  }

  // Caractères autorisés : lettres, chiffres, tirets, underscores
  const validName = /^[a-zA-Z0-9_\-]+\.algo$/;
  if (!validName.test(name)) {
    return {
      success: false,
      error: "Nom invalide (lettres, chiffres, - et _ uniquement).",
    };
  }

  return {
    success: true,
    files: { ...files, [name]: DEFAULT_ALGO_CONTENT },
    fileName: name,
  };
}