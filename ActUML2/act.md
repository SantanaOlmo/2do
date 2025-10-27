```mermaid
classDiagram

class Personaje {
  -String nombre
  -int nivel
  -int vidaActual
  -int vidaMax
  -int ataqueBase
  -int defensaBase
  -int velocidad
  +recibirDaño(cantidad:int): void
  +estaVivo(): bool
  +elegirAccion(ctx:EstadoCombate): Accion
}
<<abstract>> Personaje

class Jugador {
  -int experiencia
  -int recursoActual
  -int recursoMax
  -Inventario inventario
  -Equipo equipo
  -ClaseJugador claseJugador
  +ganarExperiencia(xp:int): void
  +subirNivel(): void
  class ObjetoConsumible {+aplicarEfecto()}
  +elegirAccion(ctx:EstadoCombate): Accion
}
Personaje <|-- Jugador

class Enemigo {
  -String tipo
  -IAComportamiento comportamiento
  +elegirAccion(ctx:EstadoCombate): Accion
}
Personaje <|-- Enemigo

class ClaseJugador {
  +calcularDañoBase(origen:Personaje, objetivo:Personaje): int
  +costoHabilidad(h:Habilidad): int
  +modificarEstadisticas(stats:Stats): Stats
}
<<interface>> ClaseJugador

ClaseJugador <|.. Guerrero
ClaseJugador <|.. Mago
ClaseJugador <|.. Arquero

class IAComportamiento {
  +decidirAccion(en:Enemigo, ctx:EstadoCombate): Accion
}
<<interface>> IAComportamiento

IAComportamiento <|.. IAAgresiva
IAComportamiento <|.. IACautelosa

class Accion {
  +ejecutar(origen:Personaje, destino:Personaje, ctx:EstadoCombate): EventoCombate
}
<<abstract>> Accion

Accion <|-- AccionAtacar
Accion <|-- AccionUsarHabilidad
Accion <|-- AccionUsarObjeto

class Habilidad {
  -String nombre
  -int costoRecurso
  -DañoTipo tipoDaño
  -int potencia
  -bool objetivoArea
  +aplicar(origen:Personaje, destino:Personaje, ctx:EstadoCombate): EventoCombate
}

class Item {
  -String nombre
  -float peso
}
<<abstract>> Item

Item <|-- ObjetoConsumible
ObjetoConsumible : +aplicarEfecto(objetivo:Personaje): EventoCombate

class Equipo {
  -Arma arma
  -Armadura armadura
}

class Arma {
  -int ataqueExtra
  -String tipo
}
Item <|-- Arma

class Armadura {
  -int defensaExtra
  -String ranura
}
Item <|-- Armadura

class Inventario {
  -List~Item~ items
  +añadir(i:Item): bool
  +remover(i:Item): bool
  +buscarPorNombre(n:String): List~Item~
}

class EstadoCombate {
  -List~Personaje~ participantes
  -Queue~Personaje~ ordenTurnos
  -Personaje turnoActual
  -List~EventoCombate~ registroEventos
  +inicializar(participantes:List~Personaje~): void
  +siguienteTurno(): void
  +obtenerObjetivosVivos(): List~Personaje~
  +finalizado(): bool
}

class CalculadoraDaño {
  +calcular(origen:Personaje, destino:Personaje, habilidad:Habilidad, arma:Arma): int
}
<<service>> CalculadoraDaño

class EventoCombate {
  -String descripcion
  -Personaje origen
  -Personaje destino
  -String efecto
}

class Stats {
  -int vidaMax
  -int ataqueBase
  -int defensaBase
  -int velocidad
  -int recursoMax
}

Jugador o-- Inventario
Jugador o-- Equipo
Equipo o-- Arma
Equipo o-- Armadura
Enemigo --> IAComportamiento
```