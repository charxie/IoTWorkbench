/*
 * @author Charles Xie
 */

// @ts-ignore
import fourier_transform from "./examples/fourier-transform.json";
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
import unary_functions from "./examples/unary-functions.json";
// @ts-ignore
import heart_function from "./examples/heart-function.json";
// @ts-ignore
import bundled_functions from "./examples/bundled-functions.json";
// @ts-ignore
import binary_functions from "./examples/binary-functions.json";
// @ts-ignore
import multivariable_functions from "./examples/multivariable-functions.json";
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

    this.files.push({name: "Logical Operators", data: logical_operators});
    this.files.push({name: "Bitwise Operators", data: bitwise_operators});
    this.files.push({name: "Arithmetic Operators", data: arithmetic_operators});
    this.files.push({name: "Global Variables", data: global_variables});
    this.files.push({name: "Series and Arrays", data: series_and_arrays});
    this.files.push({name: "Complex Numbers", data: complex_numbers});
    this.files.push({name: "Arithmetic Operators for Complex Numbers", data: arithmetic_operators_for_complex_numbers});
    this.files.push({name: "Vectors", data: vectors});
    this.files.push({name: "Matrix", data: matrix});
    this.files.push({name: "Matrix Operations", data: matrix_operations});
    this.files.push({name: "System of Linear Equations", data: linear_systems});
    this.files.push({name: "Workers", data: workers});
    this.files.push({name: "Toggle Switch vs. Momentary Switch", data: toggle_vs_momentary_switch});
    this.files.push({name: "Turnout Switch", data: turnout_switch});
    this.files.push({name: "If-Else Statements", data: if_else_statements});
    this.files.push({name: "Switch Statements", data: switch_statements});
    this.files.push({name: "Unary Functions", data: unary_functions});
    this.files.push({name: "Bundled Functions", data: bundled_functions});
    this.files.push({name: "Binary Functions", data: binary_functions});
    this.files.push({name: "Multivariable Functions", data: multivariable_functions});
    this.files.push({name: "Heart Function", data: heart_function});
    this.files.push({name: "Declared Functions", data: declared_functions});
    this.files.push({name: "Derivatives", data: derivatives});
    this.files.push({name: "Integration", data: integration});
    this.files.push({name: "Root-Finding: Bisection Method", data: root_finding_bisection_method});
    this.files.push({name: "Root-Finding: Newton-Raphson Method", data: root_finding_newton_raphson});
    this.files.push({name: "Make Sound with Beepers", data: make_sound_with_beepers});
    this.files.push({name: "Synthesizing Sound", data: synthesizing_sound});
    this.files.push({name: "Parametric Equations 1", data: parametric_equations_1});
    this.files.push({name: "Parametric Equations 2", data: parametric_equations_2});
    this.files.push({name: "Parametric Generator 1", data: parametric_generator_1});
    this.files.push({name: "Parametric Generator 2", data: parametric_generator_2});
    this.files.push({name: "Spirals", data: spirals});
    this.files.push({name: "Sunflower Pattern", data: sunflower_vogel_model});
    this.files.push({name: "Logistic Population Model", data: logistic_population_equation});
    this.files.push({name: "Predator-Prey Equations", data: predator_prey_equations});
    this.files.push({name: "Competitive Lotka-Volterra Equations", data: competitive_lotka_volterra_equations});
    this.files.push({name: "Chemical Kinetics: Irreversible Reaction", data: chemical_kinetics_irreversible_reaction});
    this.files.push({name: "Chemical Kinetics: Reversible Reaction", data: chemical_kinetics_reversible_reaction});
    this.files.push({name: "Chemical Kinetics: Brusselator", data: brusselator});
    this.files.push({name: "Projectile Motion: Implementation 1", data: projectile_motion_1});
    this.files.push({name: "Projectile Motion: Implementation 2", data: projectile_motion_2});
    this.files.push({name: "Harmonic Oscillator", data: harmonic_oscillator});
    this.files.push({name: "Pendulum", data: pendulum});
    this.files.push({name: "RLC Circuit", data: rlc_circuit});
    this.files.push({name: "Lorentz Force", data: lorentz_force});
    this.files.push({name: "The Runge-Kutta Method", data: runge_kutta_method});
    this.files.push({name: "Random Walk", data: random_walk});
    this.files.push({name: "Brownian Motion: Single Particle", data: brownian_motion_single_particle});
    this.files.push({name: "Brownian Motion: Multiple Particles", data: brownian_motion_multiple_particles});
    this.files.push({name: "Fern Generator: Implementation 1", data: fern_generator_1});
    this.files.push({name: "Fern Generator: Implementation 2", data: fern_generator_2});
    this.files.push({name: "Fourier Transform", data: fourier_transform});
    this.files.push({name: "Rainbow HAT: RGB LED Array", data: rainbow_hat_rgb_led_array});
    this.files.push({name: "Rainbow HAT: Blinking LED Lights", data: rainbow_hat_blinking_led_lights});
    this.files.push({name: "Rainbow HAT: Fading LED Array", data: rainbow_hat_fading_led_array});
    this.files.push({name: "Rainbow HAT: Sensor Data", data: rainbow_hat_sensor_data});
    this.files.push({name: "Rainbow HAT: Mixed-Reality Brownian Motion", data: rainbow_hat_brownian_motion});

    let selectElement = document.getElementById("example-list") as HTMLSelectElement;

    let option = document.createElement('option') as HTMLOptionElement;
    option.value = "select";
    option.innerHTML = "Select";
    selectElement.appendChild(option);

    for (let a of this.files) {
      option = document.createElement('option') as HTMLOptionElement;
      option.value = a.name;
      option.innerHTML = a.name;
      selectElement.appendChild(option);
    }

    let that = this;
    selectElement.onchange = function () {
      if (selectElement.selectedIndex > 0) {
        that.load(that.files[selectElement.selectedIndex - 1].data);
      }
    };
  }

  load(s): void {
    flowchart.destroy();
    StateIO.restore(s);
    flowchart.updateResults();
    flowchart.updateLocalStorage();
    system.updateLocalStorage();
  }

}
