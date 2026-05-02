import { Ionicons } from "@expo/vector-icons";

type GiftStyle = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function getGiftStyle(type: any): GiftStyle {
  const map: Record<string, GiftStyle> = {
    clothing: { icon: "shirt", color: "#E65C00" },
    shoes: { icon: "walk", color: "#6C5CE7" },
    accessories: { icon: "watch", color: "#00B894" },

    electronics: { icon: "desktop", color: "#0984E3" },
    home_appliances: { icon: "tv", color: "#636E72" },

    furniture: { icon: "bed", color: "#A29BFE" },
    home_decor: { icon: "home", color: "#FD79A8" },

    beauty: { icon: "color-palette", color: "#FF7675" },
    health: { icon: "medkit", color: "#00CEC9" },

    sports: { icon: "football", color: "#00B894" },
    outdoor: { icon: "leaf", color: "#55EFC4" },

    toys: { icon: "happy", color: "#FDCB6E" },
    games: { icon: "game-controller", color: "#6C5CE7" },

    books: { icon: "book", color: "#E17055" },
    art: { icon: "brush", color: "#D63031" },

    food: { icon: "restaurant", color: "#E84393" },
    drinks: { icon: "wine", color: "#C0392B" },

    pets: { icon: "paw", color: "#F39C12" },

    office: { icon: "briefcase", color: "#2D3436" },
    stationery: { icon: "create", color: "#636E72" },

    automotive: { icon: "car", color: "#2C3E50" },

    music: { icon: "musical-notes", color: "#8E44AD" },
    movies: { icon: "film", color: "#34495E" },

    travel: { icon: "airplane", color: "#0984E3" },

    other: { icon: "cube", color: "#B2BEC3" },
  };

  return map[type] || map["other"];
}
