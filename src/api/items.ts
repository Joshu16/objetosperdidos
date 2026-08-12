// Funciones para hablar con el servidor (objetos perdidos)
import { API_URL } from './config';
import type { LostItem } from '../types';

// Traer la lista de objetos
export async function fetchItems(search?: string, category?: string) {
  // Armamos la URL con los filtros
  var url = API_URL + '/items?';

  if (search) {
    url = url + 'search=' + encodeURIComponent(search) + '&';
  }

  // "Todas" no se manda al servidor
  if (category && category !== 'Todas') {
    url = url + 'category=' + encodeURIComponent(category) + '&';
  }

  var res = await fetch(url);

  if (!res.ok) {
    throw new Error('No se pudieron cargar los objetos');
  }

  var data: LostItem[] = await res.json();
  return data;
}

// Subir un objeto nuevo
export async function createItem(datos: {
  title: string;
  description?: string;
  category: string;
  reportedBy: string;
  imageBase64: string;
  imageMimeType: string;
}) {
  var res = await fetch(API_URL + '/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    throw new Error('No se pudo subir el objeto');
  }

  var data: LostItem = await res.json();
  return data;
}

// Marcar un objeto como encontrado
export async function markItemFound(id: string) {
  var res = await fetch(API_URL + '/items/' + id + '/found', {
    method: 'PATCH',
  });

  if (!res.ok) {
    throw new Error('No se pudo marcar como encontrado');
  }

  var data: LostItem = await res.json();
  return data;
}
