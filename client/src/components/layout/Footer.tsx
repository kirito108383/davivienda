export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-[#ED1C24] font-bold mb-4 font-display">Contáctenos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Bogotá: 338 38 38</li>
              <li>Resto del país: 01 8000 12 38 38</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#ED1C24] font-bold mb-4 font-display">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Términos y condiciones</li>
              <li>Políticas de privacidad</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#ED1C24] font-bold mb-4 font-display">Seguridad</h3>
            <p className="text-sm text-gray-600">
              Banco Davivienda S.A. todos los derechos reservados 2024.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          <p>Vigilado Superintendencia Financiera de Colombia</p>
        </div>
      </div>
    </footer>
  );
}
