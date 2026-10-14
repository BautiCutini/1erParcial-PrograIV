// lo creo por un tema de limpieza de codigo y para que solo quede escrito una vez el id de cada clase, y no tener que repetirlo en cada clase

export function generarId(...partes: string[]): string {
  return partes.join('-').toLowerCase().replaceAll(' ', '-');
}