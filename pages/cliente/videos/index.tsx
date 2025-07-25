"use client"

import Link from "next/link"
import { modules, getCourseById } from "@/lib/utils"
import { Play, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import HeaderCliente from "@/components/header/header-cliente"
import FiltersSearch from "@/components/filters/filters-search"
import VideoCard from "@/components/card/video-card";
import Footer from "@/pages/cliente/main/footer";
import InfoAdicional from "../cursos/info-adicional";
import { useFetchVideos } from "@/hooks/videos";
import CursoCardSkeleton from "@/components/card/curso-skeleton-card";
import { useState } from "react";

export default function VideosPage() {
  const { videos, loading, error } = useFetchVideos();
  const allVideos = videos || [];

  // Estados para búsqueda y filtro
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Filtrado de videos
  const filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? video.id === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderCliente />
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Biblioteca de Videos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra colección de videos educativos sobre gestión de proyectos y desarrollo profesional
            </p>
          </div>
          <FiltersSearch
            placeholder="Buscar videos"
            filters={allVideos.map(video => ({ id: video.id, value: video.id, name: video.title }))}
            search={search}
            onSearch={setSearch}
            filter={filter}
            onFilter={setFilter}
          />
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CursoCardSkeleton key={index} />
              ))}
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center mb-6 h-[50dvh]">
              <p className="text-muted-foreground text-center">
                ocurrio un error al cargar los videos, por favor intente más tarde.
              </p>
            </div>
          )}
          {!loading && !error && (
            filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <Link href={`/videos/${video.id}`} key={index} className="h-full">
                    <VideoCard
                      key={video.id}
                      delay={index * 0.1}
                      video={video}
                      type="cliente"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                No se encontraron videos con los criterios seleccionados.
              </div>
            )
          )}
          <div className="bg-muted/50 py-12 md:py-24 mt-12">
            <InfoAdicional />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

