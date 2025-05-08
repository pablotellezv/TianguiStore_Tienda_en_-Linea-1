const { exec } = require('child_process');
const ProgressBar = require('progress');
const path = require('path');

// Configuración de la barra de progreso
const bar = new ProgressBar(':bar :percent :etas', {
  total: 100,
  width: 40,            // Longitud de la barra
  complete: '=',        // Carácter para el progreso
  incomplete: ' ',      // Carácter para el espacio vacío
  renderThrottle: 100,  // Tiempo de retraso entre actualizaciones de la barra
});

// Ejecutar el proceso de `npm install` desde el directorio raíz del proyecto
const install = exec('npm install', { cwd: path.resolve(__dirname) });

// Actualizar la barra de progreso con la salida de `npm install`
install.stdout.on('data', (data) => {
  // Si la salida contiene el progreso de la instalación, incrementamos la barra.
  // Usamos el tamaño de la salida para hacerla progresiva
  bar.tick(1);  // Incrementar el progreso por cada evento de salida
});

// En caso de error, mostramos un mensaje y detenemos la instalación.
install.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
  process.exit(1);  // Detener el proceso si ocurre un error
});

// Al finalizar la instalación, mostramos el mensaje final
install.on('close', (code) => {
  if (code === 0) {
    console.log('\nLa instalación de dependencias se completó con éxito!');
  } else {
    console.error(`npm install terminó con código ${code}`);
  }
});
