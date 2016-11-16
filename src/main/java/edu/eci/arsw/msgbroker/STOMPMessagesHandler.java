/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

import edu.eci.arsw.msgbroker.model.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author alejandro
 */
@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;
    
    List<Point> puntos = new ArrayList<Point>();

    @MessageMapping("/newpoint")    
    public void getLine(Point pt) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        /*        
        puntos.add(pt);
       
        if(puntos.size() == 4) {
            getPolygon(puntos);
        }*/
        
        agregaPunto(pt);
        
        msgt.convertAndSend("/topic/newpoint", pt);
    }
    
    @MessageMapping("/newpolygon")  
    public void getPolygon(List<Point> pts) throws Exception {
        System.out.println("Nuevo arreglo de puntos recibido en el servidor!:"+pts);
        msgt.convertAndSend("/topic/newpolygon", pts);
        puntos = new ArrayList<Point>();
    }
    
    @RequestMapping(value = "/puntos", method = RequestMethod.POST)    
    public ResponseEntity<?> manejadorPostRecursoXX(@RequestBody Point pt){
        try {
            //registrar dato
            agregaPunto(pt);
            
            msgt.convertAndSend("/topic/newpoint", pt);
            
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception ex) {
            Logger.getLogger(STOMPMessagesHandler.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error bla bla bla",HttpStatus.FORBIDDEN);            
        }        
    }     
    
    private void agregaPunto(Point pt) throws Exception{
        puntos.add(pt);
        
        if(puntos.size() == 4) {
            getPolygon(puntos);
        }
        
    }
}