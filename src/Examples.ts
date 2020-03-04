/*
 * @author Charles Xie
 */

// @ts-ignore
import poisson_equation from "./examples/poisson-equation.json";
// @ts-ignore
import mixed_boundary_condition from "./examples/mixed-boundary-condition.json";
// @ts-ignore
import boundary_value_problems from "./examples/boundary-value-problems.json";
// @ts-ignore
import laplace_equation from "./examples/laplace-equation.json";
// @ts-ignore
import contour_plot_settings from "./examples/contour-plot-settings.json";
// @ts-ignore
import bivariate_functions_contour_plots from "./examples/bivariate-functions-contour-plots.json";
// @ts-ignore
import himmelblau_function from "./examples/himmelblau-function.json";
// @ts-ignore
import standing_waves from "./examples/standing-waves.json";
// @ts-ignore
import wave_equation from "./examples/wave-equation.json";
// @ts-ignore
import heat_equation from "./examples/heat-equation.json";
// @ts-ignore
import transport_equation from "./examples/transport-equation.json";
// @ts-ignore
import pde_fdm_solver from "./examples/pde-fdm-solver.json";
// @ts-ignore
import pde_numerical_stability from "./examples/pde-numerical-stability.json";
// @ts-ignore
import normal_distributions from "./examples/normal-distributions.json";
// @ts-ignore
import box_muller_transform from "./examples/box-muller-transform.json";
// @ts-ignore
import rossler_attactor from "./examples/rossler-attractor.json";
// @ts-ignore
import ode_solver from "./examples/ode-solver.json";
// @ts-ignore
import chua_circuit from "./examples/chua-circuit.json";
// @ts-ignore
import lorenz_attractor from "./examples/lorenz-attractor.json";
// @ts-ignore
import fourier_transform from "./examples/fourier-transform.json";
// @ts-ignore
import convolution_theorem from "./examples/convolution-theorem.json";
// @ts-ignore
import rainbow_hat_brownian_motion from "./examples/rainbow-hat-brownian-motion.json";
// @ts-ignore
import rainbow_hat_fading_led_array from "./examples/rainbow-hat-fading-led-array.json";
// @ts-ignore
import rainbow_hat_rgb_led_array from "./examples/rainbow-hat-rgb-led-array.json";
// @ts-ignore
import rainbow_hat_blinking_led_lights from "./examples/rainbow-hat-blinking-led-lights.json";
// @ts-ignore
import rainbow_hat_sensor_data from "./examples/rainbow-hat-sensor-data.json";
// @ts-ignore
import root_finding_bisection_method from "./examples/root-finding-bisection-method.json";
// @ts-ignore
import root_finding_newton_raphson from "./examples/root-finding-newton-raphson.json";
// @ts-ignore
import runge_kutta_method from "./examples/runge-kutta-method.json";
// @ts-ignore
import logistic_population_equation from "./examples/logistic-population-equation.json";
// @ts-ignore
import predator_prey_equations from "./examples/predator-prey-equations.json";
// @ts-ignore
import epidemiology_sir_model from "./examples/epidemiology-sir-model.json";
// @ts-ignore
import competitive_lotka_volterra_equations from "./examples/competitive-lotka-volterra-equations.json";
// @ts-ignore
import chemical_kinetics_irreversible_reaction from "./examples/chemical-kinetics-irreversible-reaction.json";
// @ts-ignore
import chemical_kinetics_reversible_reaction from "./examples/chemical-kinetics-reversible-reaction.json";
// @ts-ignore
import brusselator from "./examples/brusselator.json";
// @ts-ignore
import lorentz_force from "./examples/lorentz-force.json";
// @ts-ignore
import harmonic_oscillator from "./examples/harmonic-oscillator.json";
// @ts-ignore
import van_der_pol_oscillator from "./examples/van-der-pol-oscillator.json";
// @ts-ignore
import pendulum from "./examples/pendulum.json";
// @ts-ignore
import rlc_circuit from "./examples/rlc-circuit.json";
// @ts-ignore
import projectile_motion_1 from "./examples/projectile-motion-1.json";
// @ts-ignore
import projectile_motion_2 from "./examples/projectile-motion-2.json";
// @ts-ignore
import brownian_motion_single_particle from "./examples/brownian-motion-single-particle.json";
// @ts-ignore
import brownian_motion_multiple_particles from "./examples/brownian-motion-multiple-particles.json";
// @ts-ignore
import langevin_equation from "./examples/langevin-equation.json";
// @ts-ignore
import random_walk from "./examples/random-walk.json";
// @ts-ignore
import spirals from "./examples/spirals.json";
// @ts-ignore
import sunflower_vogel_model from "./examples/sunflower-vogel-model.json";
// @ts-ignore
import fern_generator_1 from "./examples/fern-generator-1.json";
// @ts-ignore
import fern_generator_2 from "./examples/fern-generator-2.json";
// @ts-ignore
import logical_operators from "./examples/logical-operators.json";
// @ts-ignore
import bitwise_operators from "./examples/bitwise-operators.json";
// @ts-ignore
import arithmetic_operators from "./examples/arithmetic-operators.json";
// @ts-ignore
import global_variables from "./examples/global-variables.json";
// @ts-ignore
import series_and_arrays from "./examples/series-and-arrays.json";
// @ts-ignore
import complex_numbers from "./examples/complex-numbers.json";
// @ts-ignore
import vectors from "./examples/vectors.json";
// @ts-ignore
import matrix from "./examples/matrix.json";
// @ts-ignore
import matrix_operations from "./examples/matrix-operations.json";
// @ts-ignore
import linear_systems from "./examples/linear-systems.json";
// @ts-ignore
import arithmetic_operators_for_complex_numbers from "./examples/arithmetic-operators-for-complex-numbers.json";
// @ts-ignore
import derivatives from "./examples/derivatives.json";
// @ts-ignore
import integration from "./examples/integration.json";
// @ts-ignore
import univariate_functions from "./examples/univariate-functions.json";
// @ts-ignore
import heart_function from "./examples/heart-function.json";
// @ts-ignore
import bundled_functions from "./examples/bundled-functions.json";
// @ts-ignore
import bivariate_functions from "./examples/bivariate-functions.json";
// @ts-ignore
import multivariate_functions from "./examples/multivariate-functions.json";
// @ts-ignore
import declared_functions from "./examples/declared-functions.json";
// @ts-ignore
import toggle_vs_momentary_switch from "./examples/toggle-vs-momentary-switch.json";
// @ts-ignore
import turnout_switch from "./examples/turnout-switch.json";
// @ts-ignore
import switch_statements from "./examples/switch-statements.json";
// @ts-ignore
import if_else_statements from "./examples/if-else-statements.json";
// @ts-ignore
import workers from "./examples/workers.json";
// @ts-ignore
import make_sound_with_beepers from "./examples/make-sound-with-beepers.json";
// @ts-ignore
import synthesizing_sound from "./examples/synthesizing-sound.json";
// @ts-ignore
import parametric_equations_1 from "./examples/parametric-equations-1.json";
// @ts-ignore
import parametric_equations_2 from "./examples/parametric-equations-2.json";
// @ts-ignore
import parametric_generator_1 from "./examples/parametric-generator-1.json";
// @ts-ignore
import parametric_generator_2 from "./examples/parametric-generator-2.json";

import {flowchart, system} from "./Main";
import {StateIO} from "./StateIO";

export class Examples {

  readonly files = [];

  constructor() {

    this.files.push({name: "Basics: Logical Operators", data: logical_operators});
    this.files.push({name: "Basics: Bitwise Operators", data: bitwise_operators});
    this.files.push({name: "Basics: Arithmetic Operators", data: arithmetic_operators});
    this.files.push({name: "Basics: Global Variables", data: global_variables});
    this.files.push({name: "Basics: Series and Arrays", data: series_and_arrays});
    this.files.push({name: "Basics: Complex Numbers", data: complex_numbers});
    this.files.push({
      name: "Basics: Arithmetic Operators for Complex Numbers",
      data: arithmetic_operators_for_complex_numbers
    });
    this.files.push({name: "Basics: Workers", data: workers});
    this.files.push({name: "Basics: Toggle Switch vs. Momentary Switch", data: toggle_vs_momentary_switch});
    this.files.push({name: "Basics: Turnout Switch", data: turnout_switch});
    this.files.push({name: "Basics: If-Else Statements", data: if_else_statements});
    this.files.push({name: "Basics: Switch Statements", data: switch_statements});
    this.files.push({name: "Math: Univariate Functions", data: univariate_functions});
    this.files.push({name: "Math: Bundled Functions", data: bundled_functions});
    this.files.push({name: "Math: Bivariate Function 1D Output", data: bivariate_functions});
    this.files.push({name: "Math: Bivariate Function 2D Output", data: himmelblau_function});
    this.files.push({name: "Math: Bivariate Function Contour Plots", data: bivariate_functions_contour_plots});
    this.files.push({name: "Math: Contour Plot Settings", data: contour_plot_settings});
    this.files.push({name: "Math: Multivariate Functions", data: multivariate_functions});
    this.files.push({name: "Math: Heart Function", data: heart_function});
    this.files.push({name: "Math: Declared Functions", data: declared_functions});
    this.files.push({name: "Math: Parametric Equations 1", data: parametric_equations_1});
    this.files.push({name: "Math: Parametric Equations 2", data: parametric_equations_2});
    this.files.push({name: "Math: Parametric Generator 1", data: parametric_generator_1});
    this.files.push({name: "Math: Parametric Generator 2", data: parametric_generator_2});
    this.files.push({name: "Math: Spirals", data: spirals});
    this.files.push({name: "Math: Sunflower Pattern", data: sunflower_vogel_model});
    this.files.push({name: "Sound: Make Sound with Beepers", data: make_sound_with_beepers});
    this.files.push({name: "Sound: Synthesizing Sound", data: synthesizing_sound});
    this.files.push({name: "Root Finding: Bisection Method", data: root_finding_bisection_method});
    this.files.push({name: "Root Finding: Newton-Raphson Method", data: root_finding_newton_raphson});
    this.files.push({name: "Linear Algebra: Vectors", data: vectors});
    this.files.push({name: "Linear Algebra: Matrix", data: matrix});
    this.files.push({name: "Linear Algebra: Matrix Operations", data: matrix_operations});
    this.files.push({name: "Linear Algebra: System of Linear Equations", data: linear_systems});
    this.files.push({name: "Calculus: Derivatives", data: derivatives});
    this.files.push({name: "Calculus: Integration", data: integration});
    this.files.push({name: "Calculus: The Runge-Kutta Method", data: runge_kutta_method});
    this.files.push({name: "Calculus: ODE Solver", data: ode_solver});
    this.files.push({name: "Statistics: Box-Muller Transform", data: box_muller_transform});
    this.files.push({name: "Statistics: Normal Distributions", data: normal_distributions});
    this.files.push({name: "Statistics: Random Walk", data: random_walk});
    this.files.push({name: "Ecology: Logistic Population Model", data: logistic_population_equation});
    this.files.push({name: "Ecology: Predator-Prey Equations", data: predator_prey_equations});
    this.files.push({
      name: "Ecology: Competitive Lotka-Volterra Equations",
      data: competitive_lotka_volterra_equations
    });
    this.files.push({name: "Epidemiology: The SIR Model", data: epidemiology_sir_model});
    this.files.push({name: "Chemistry: Irreversible Reaction", data: chemical_kinetics_irreversible_reaction});
    this.files.push({name: "Chemistry: Reversible Reaction", data: chemical_kinetics_reversible_reaction});
    this.files.push({name: "Chemistry: Brusselator", data: brusselator});
    this.files.push({name: "Chaos: Lorenz Attractor", data: lorenz_attractor});
    this.files.push({name: "Chaos: Rössler Attactor", data: rossler_attactor});
    this.files.push({name: "Fractals: Fern Generator 1", data: fern_generator_1});
    this.files.push({name: "Fractals: Fern Generator 2", data: fern_generator_2});
    this.files.push({name: "Mechanics: Projectile Motion 1", data: projectile_motion_1});
    this.files.push({name: "Mechanics: Projectile Motion 2", data: projectile_motion_2});
    this.files.push({name: "Mechanics: Harmonic Oscillator", data: harmonic_oscillator});
    this.files.push({name: "Mechanics: Pendulum", data: pendulum});
    this.files.push({name: "Electronics: RLC Circuit", data: rlc_circuit});
    this.files.push({name: "Electronics: Chua Circuit", data: chua_circuit});
    this.files.push({name: "Electronics: Van der Pol Oscillator", data: van_der_pol_oscillator});
    this.files.push({name: "Electromagnetism: Lorentz Force", data: lorentz_force});
    this.files.push({name: "Biology: Brownian Motion", data: brownian_motion_single_particle});
    this.files.push({name: "Biology: Langevin Equation", data: langevin_equation});
    this.files.push({
      name: "Biology: Brownian Motion with Multiple Particles",
      data: brownian_motion_multiple_particles
    });
    this.files.push({name: "Signal Processing: Fourier Transform", data: fourier_transform});
    this.files.push({name: "Signal Processing: Convolution Theorem", data: convolution_theorem});
    this.files.push({name: "Simulation: Transient State Finite Difference Method", data: pde_fdm_solver});
    this.files.push({name: "Simulation: Numerical Stability", data: pde_numerical_stability});
    this.files.push({name: "Simulation: Heat Equation", data: heat_equation});
    this.files.push({name: "Simulation: Wave Equation", data: wave_equation});
    this.files.push({name: "Simulation: Transport Equation", data: transport_equation});
    this.files.push({name: "Simulation: Standing Waves", data: standing_waves});
    this.files.push({name: "Simulation: Steady State Finite Difference Method", data: laplace_equation});
    this.files.push({name: "Simulation: Poisson Equation", data: poisson_equation});
    this.files.push({name: "Simulation: Boundary Value Problems", data: boundary_value_problems});
    this.files.push({name: "Simulation: Mixed Boundary Condition", data: mixed_boundary_condition});
    this.files.push({name: "Rainbow HAT: RGB LED Array", data: rainbow_hat_rgb_led_array});
    this.files.push({name: "Rainbow HAT: Blinking LED Lights", data: rainbow_hat_blinking_led_lights});
    this.files.push({name: "Rainbow HAT: Fading LED Array", data: rainbow_hat_fading_led_array});
    this.files.push({name: "Rainbow HAT: Sensor Data", data: rainbow_hat_sensor_data});
    this.files.push({name: "Rainbow HAT: Mixed-Reality Brownian Motion", data: rainbow_hat_brownian_motion});

    let selectElement = document.getElementById("example-list") as HTMLSelectElement;

    let option = document.createElement('option') as HTMLOptionElement;
    option.value = "select";
    option.innerHTML = "Select Tutorial";
    selectElement.appendChild(option);

    let i = 1;
    for (let a of this.files) {
      option = document.createElement('option') as HTMLOptionElement;
      option.value = a.name;
      option.innerHTML = i++ + ". " + a.name;
      selectElement.appendChild(option);

    }

    let that = this;
    selectElement.onchange = function () {
      if (selectElement.selectedIndex > 0) {
        that.load(that.files[selectElement.selectedIndex - 1].data);
      }
    };
  }

  loadPrevious(): void {
    let selectElement = document.getElementById("example-list") as HTMLSelectElement;
    if (selectElement.selectedIndex > 1) {
      selectElement.selectedIndex--;
      this.load(this.files[selectElement.selectedIndex - 1].data);
    }
  }

  loadNext(): void {
    let selectElement = document.getElementById("example-list") as HTMLSelectElement;
    if (selectElement.selectedIndex < selectElement.length - 1) {
      selectElement.selectedIndex++;
      this.load(this.files[selectElement.selectedIndex - 1].data);
    }
  }

  load(s): void {
    flowchart.destroy();
    StateIO.restore(s);
    flowchart.updateResultsExcludingAllWorkerBlocks();
    flowchart.updateLocalStorage();
    system.updateLocalStorage();
  }

}
