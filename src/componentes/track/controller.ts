import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verify_authentication } from "../authenticate";
import { FileWatcherEventKind } from "typescript";

const secret_key = process.env.SECRET_KEY || 'Alguna llave secreta';
const prisma = new PrismaClient();

// CREATE Tracks

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const {name, artist, album, year, genre, duration, is_private} = req.body;
    await prisma.track.create({ data :{
            name,
            artist,
            album,
            year: new Date(year),
            genre,
            duration,
            is_private,
    }});

    res.status(201).json({ ok: true, message: "Track creado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error });
  }
};

// GET all tracks public or private with authentication

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const tracks_public = await prisma.track.findMany({
      where:{ is_private : false}
    });

    const tracks = await prisma.track.findMany();
    if(verify_authentication(req, secret_key)){
      res.status(200).json({
        ok: true,
        data: tracks,
      });
    }else{
      res.status(200).json({
        ok: true,
        data: tracks_public,
      });
    }
  } catch (error) {
    res.status(500).json({ ok: false, message: error });
  }
};

// GET Tracks by {ID}

export  const get_track_by_id = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  
  try {
    const tracks = await prisma.track.findUnique({
      where: { id }
    });
    res.status(200).json({
      data: tracks,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error });
  }
};

// UPDATE Tracks by {ID}

export  const update_track = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const {name, artist, album, year, genre, duration} = req.body;
  try {
    const tracks = await prisma.track.update({
      where: { id },
      data :{
        name,
        artist,
        album,
        year: new Date(year),
        genre,
        duration
    }});
    res.status(200).json({
      message: "Actualizado correctamente",
      data: tracks,
    });

  } catch (error) {
    res.status(204).json({ ok: false, message: error });
  }
};

//DELETE Track by {ID}

export const delete_track_by_id = async(req: Request, res: Response) => {
  const id: number = parseInt(req.params.id)

  try{
    await prisma.track.delete({
      where : {id},
    });
    res.status(200).json({
      ok: true, message: "Eliminado Correctamente"
    });
  }catch(error){
    res.status(500).json({
      ok:false, message: error
    });
  }
};