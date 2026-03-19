import React, { useEffect, useState } from "react";
import Layout from "../hocs/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, ButtonGroup, Button, Row, Col } from "react-bootstrap";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { listaInventarioAnularActions } from "../../redux/actions/Inventario/AnularInventario/listaInventarioAnularActions";
import { Objeto } from "../../components/Navegacion/Profile";
import { useInventarioIngresos } from "../../components/Dashboard/Hooks/useInventarioIngresos";
import InventarioIngresosChart from "../../components/Dashboard/InventarioIngresosChart";

type PeriodoIngreso = "dia" | "mes" | "anio";

interface Parametros {
  aF_FINGRESO: string;
}

interface Props {
  listaInventarioAnular: Parametros[];
  listaInventarioAnularActions: (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, estabL_CORR: number) => Promise<boolean>;
  objeto: Objeto;
}

const Dashboard: React.FC<Props> = ({
  listaInventarioAnularActions,
  listaInventarioAnular,
  objeto,
}) => {
  const [periodo, setPeriodo] = useState<PeriodoIngreso>("dia");
  const hoy = new Date().toISOString().split("T")[0];
  const [fechaInicio, setFechaInicio] = useState(hoy);
  const [fechaFin, setFechaFin] = useState(hoy);

  // 🔹 Carga inicial
  useEffect(() => {
    if (listaInventarioAnular.length === 0) {
      listaInventarioAnularActions("", "", "", objeto.Roles[0].codigoEstablecimiento);
    }
  }, [listaInventarioAnular, listaInventarioAnularActions, objeto]);

  // 🔹 Datos procesados (hook)
  const ingresos = useInventarioIngresos(listaInventarioAnular, periodo);

  return (
    <Layout>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mt-3">

            {/* KPI */}
            <Row className="g-3 mb-4">
              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">Total de Activos</div>
                  <h3 className="text-primary mb-0">
                    {listaInventarioAnular.length}
                  </h3>
                </Card>
              </Col>

              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">Valor Inventario</div>
                  <h4 className="text-success mb-0">
                    {ingresos.reduce((a, b) => a + b.total, 0)}
                  </h4>
                </Card>
              </Col>

              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">Depreciación</div>
                  <h5 className="mb-0 text-dark">--</h5>
                </Card>
              </Col>

              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">Altas</div>
                  <h4 className="text-primary mb-0">
                    {ingresos[ingresos.length - 1]?.total || 0}
                  </h4>
                </Card>
              </Col>

              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">Bajas</div>
                  <h4 className="text-danger mb-0">--</h4>
                </Card>
              </Col>

              <Col lg={2} md={4} sm={6}>
                <Card className="shadow-sm text-center h-100 p-3">
                  <div className="text-muted small">% En Uso</div>
                  <h4 className="text-success mb-0">--%</h4>
                </Card>
              </Col>
            </Row>

            {/* CONTROLES DE PERIODO */}
            <Row className="mb-3 g-2 align-items-end">
              {/* Título */}
              <Col md={3}>
                <h5 className="fw-bold mb-0">Ingresos de Inventario</h5>
              </Col>

              {/* Selector de periodo */}
              <Col md="auto">
                <ButtonGroup>
                  <Button
                    size="sm"
                    variant={periodo === "dia" ? "primary" : "outline-primary"}
                    onClick={() => setPeriodo("dia")}
                  >
                    Día
                  </Button>
                  <Button
                    size="sm"
                    variant={periodo === "mes" ? "primary" : "outline-primary"}
                    onClick={() => setPeriodo("mes")}
                  >
                    Mes
                  </Button>
                  <Button
                    size="sm"
                    variant={periodo === "anio" ? "primary" : "outline-primary"}
                    onClick={() => setPeriodo("anio")}
                  >
                    Año
                  </Button>
                </ButtonGroup>
              </Col>

              {/* Fecha inicio */}
              <Col md={2}>
                <label className="form-label small text-muted mb-1">
                  Desde
                </label>
                <input
                  aria-label="date"
                  type="date"
                  className="form-control form-control-sm"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Col>

              {/* Fecha fin */}
              <Col md={2}>
                <label className="form-label small text-muted mb-1">
                  Hasta
                </label>
                <input
                  aria-label="date"
                  type="date"
                  className="form-control form-control-sm"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Col>

              {/* Botón aplicar */}
              <Col md="auto">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => listaInventarioAnularActions("", fechaInicio, fechaFin, objeto.Roles[0].codigoEstablecimiento)}>
                  Aplicar
                </Button>
              </Col>
            </Row>

            {/* DASHBOARD */}
            <Row className="g-3 mb-3">
              {/* Principal */}
              <Col lg={6}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Evolución del Inventario
                    </Card.Title>
                    <InventarioIngresosChart data={ingresos} type="line" />
                  </Card.Body>
                </Card>
              </Col>

              {/* Categorías */}
              <Col lg={3}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Distribución por Categoría
                    </Card.Title>
                    <InventarioIngresosChart data={ingresos} type="doughnut" />
                  </Card.Body>
                </Card>
              </Col>

              {/* Ubicación */}
              <Col lg={3}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Activos por Ubicación
                    </Card.Title>
                    <InventarioIngresosChart data={ingresos} type="bar" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-3">
              <Col lg={6}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Movimientos del Inventario
                    </Card.Title>
                    <InventarioIngresosChart data={ingresos} type="bar" />
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Depreciación
                    </Card.Title>
                    <InventarioIngresosChart data={ingresos} type="bar" />
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      Alertas
                    </Card.Title>
                    <ul className="mb-0 small">
                      <li>Próximos a depreciación total</li>
                      <li>Sin movimiento en 6 meses</li>
                      <li>Sin responsable asignado</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  listaInventarioAnular: state.listaInventarioAnularReducers.listaInventarioAnular,
  objeto: state.validaApiLoginReducers,
});

export default connect(mapStateToProps, {
  listaInventarioAnularActions,
})(Dashboard);
