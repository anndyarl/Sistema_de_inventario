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
  listaInventarioAnularActions: (
    af_codigo_generico: string,
    FechaInicio: string,
    FechaTermino: string,
    estabL_CORR: number
  ) => Promise<boolean>;
  objeto: Objeto;
}

const Dashboard: React.FC<Props> = ({
  listaInventarioAnularActions,
  listaInventarioAnular,
  objeto,
}) => {
  const [periodo, setPeriodo] = useState<PeriodoIngreso>("dia");

  // 🔹 Carga inicial
  useEffect(() => {
    if (listaInventarioAnular.length === 0) {
      listaInventarioAnularActions(
        "",
        "",
        "",
        objeto.Roles[0].codigoEstablecimiento
      );
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

            {/* ===============================
                🎛️ CONTROLES DE PERIODO
            =============================== */}
            <Card className="shadow-sm p-3 mb-3">
              <Card.Title className="fw-bold text-center">
                Ingresos de Inventario
              </Card.Title>

              <ButtonGroup className="d-flex justify-content-center">
                <Button
                  variant={periodo === "dia" ? "primary" : "outline-primary"}
                  onClick={() => setPeriodo("dia")}
                >
                  Día
                </Button>
                <Button
                  variant={periodo === "mes" ? "primary" : "outline-primary"}
                  onClick={() => setPeriodo("mes")}
                >
                  Mes
                </Button>
                <Button
                  variant={periodo === "anio" ? "primary" : "outline-primary"}
                  onClick={() => setPeriodo("anio")}
                >
                  Año
                </Button>
              </ButtonGroup>
            </Card>

            {/* ===============================
                📊 GRÁFICOS
            =============================== */}
            <Row className="g-3">

              {/* Evolución */}
              <Col lg={4}>
                <Card className="shadow-sm p-3 h-100">
                  <Card.Title className="fw-bold text-center">
                    Evolución de Ingresos
                  </Card.Title>
                  <InventarioIngresosChart data={ingresos} type="line" />
                </Card>
              </Col>

              {/* Distribución */}
              <Col lg={4}>
                <Card className="shadow-sm p-3 h-100">
                  <Card.Title className="fw-bold text-center">
                    Distribución
                  </Card.Title>
                  <InventarioIngresosChart data={ingresos} type="doughnut" />
                </Card>
              </Col>

              {/* Comparación */}
              <Col lg={4}>
                <Card className="shadow-sm p-3 h-100">
                  <Card.Title className="fw-bold text-center">
                    Comparación por Periodo
                  </Card.Title>
                  <InventarioIngresosChart data={ingresos} type="bar" />
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
