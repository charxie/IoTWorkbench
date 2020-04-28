/*
 * @author Charles Xie
 */

// @ts-ignore
import helicopter_retrieval from "./examples/helicopter-retrieval.json";
// @ts-ignore
import metronome from "./examples/metronome.json";
// @ts-ignore
import lennard_jones_potential from "./examples/lennard-jones-potential.json";
// @ts-ignore
import symplectic_integrator from "./examples/symplectic-integrator.json";
// @ts-ignore
import gas_molecules from "./examples/gas-molecules.json";
// @ts-ignore
import dna_molecule from "./examples/dna-molecule.json";
// @ts-ignore
import alloy from "./examples/alloy.json";
// @ts-ignore
import nanocar from "./examples/nanocar.json";
// @ts-ignore
import nano_gear from "./examples/nano-gear.json";
// @ts-ignore
import crystal_structure from "./examples/crystal-structure.json";
// @ts-ignore
import molecular_structure from "./examples/molecular-structure.json";
// @ts-ignore
import molecular_visualization from "./examples/molecular-visualization.json";
// @ts-ignore
import clelia from "./examples/clelia.json";
// @ts-ignore
import plucker_conoid from "./examples/plucker-conoid.json";
// @ts-ignore
import bohemian_dome from "./examples/bohemian-dome.json";
// @ts-ignore
import klein_bottle from "./examples/klein-bottle.json";
// @ts-ignore
import astroidal_ellipsoid from "./examples/astroidal-ellipsoid.json";
// @ts-ignore
import helicoid from "./examples/helicoid.json";
// @ts-ignore
import hyperboloid from "./examples/hyperboloid.json";
// @ts-ignore
import dupin_cyclide from "./examples/dupin-cyclide.json";
// @ts-ignore
import breather_surface from "./examples/breather-surface.json";
// @ts-ignore
import boy_roman_surfaces from "./examples/boy-roman-surfaces.json";
// @ts-ignore
import seashell from "./examples/seashell.json";
// @ts-ignore
import mobius_strip from "./examples/mobius-strip.json";
// @ts-ignore
import torus from "./examples/torus.json";
// @ts-ignore
import knots from "./examples/knots.json";
// @ts-ignore
import crank_rocker from "./examples/crank-rocker.json";
// @ts-ignore
import slider_crank_offset from "./examples/slider-crank-offset.json";
// @ts-ignore
import slider_crank_inline from "./examples/slider-crank-inline.json";
// @ts-ignore
import scotch_yoke from "./examples/scotch-yoke.json";
// @ts-ignore
import hypotrochoid_epitrochoid from "./examples/hypotrochoid-epitrochoid.json";
// @ts-ignore
import trochoid from "./examples/trochoid.json";
// @ts-ignore
import thomas_attractor from "./examples/thomas-attractor.json";
// @ts-ignore
import fisher_equation from "./examples/fisher-equation.json";
// @ts-ignore
import de_jong_map from "./examples/de-jong-map.json";
// @ts-ignore
import henon_map from "./examples/henon-map.json";
// @ts-ignore
import ikeda_map from "./examples/ikeda-map.json";
// @ts-ignore
import tinkerbell_map from "./examples/tinkerbell-map.json";
// @ts-ignore
import kaplan_yorke_map from "./examples/kaplan–yorke-map.json";
// @ts-ignore
import hindmarsh_rose_model from "./examples/hindmarsh-rose-model.json";
// @ts-ignore
import gradient_descent_1d from "./examples/gradient-descent-1d.json";
// @ts-ignore
import gradient_descent_2d from "./examples/gradient-descent-2d.json";
// @ts-ignore
import duffing_map from "./examples/duffing-map.json";
// @ts-ignore
import three_body_problem from "./examples/three-body-problem.json";
// @ts-ignore
import two_body_problem from "./examples/two-body-problem.json";
// @ts-ignore
import two_body_problem_3d from "./examples/two-body-problem-3d.json";
// @ts-ignore
import satellite_orbits from "./examples/satellite-orbits.json";
// @ts-ignore
import simple_math_game from "./examples/simple-math-game.json";
// @ts-ignore
import import_datasets from "./examples/import-datasets.json";
// @ts-ignore
import rayleigh_benard_convection from "./examples/rayleigh-benard-convection.json";
// @ts-ignore
import fdm_stabilization from "./examples/fdm-stabilization.json";
// @ts-ignore
import convection_diffusion_equation from "./examples/convection-diffusion-equation.json";
// @ts-ignore
import compare_iterative_methods from "./examples/compare-iterative-methods.json";
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
import bivariate_functions_surface_plots from "./examples/bivariate-functions-surface-plots.json";
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
import poisson_distribution from "./examples/poisson-distribution.json";
// @ts-ignore
import box_muller_transform from "./examples/box-muller-transform.json";
// @ts-ignore
import rossler_attractor from "./examples/rossler-attractor.json";
// @ts-ignore
import ode_solver from "./examples/ode-solver.json";
// @ts-ignore
import chua_circuit from "./examples/chua-circuit.json";
// @ts-ignore
import logistic_map from "./examples/logistic-map.json";
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
import epidemiology_seir_model from "./examples/epidemiology-seir-model.json";
// @ts-ignore
import epidemiology_sis_model from "./examples/epidemiology-sis-model.json";
// @ts-ignore
import epidemiology_seis_model from "./examples/epidemiology-seis-model.json";
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
import lorentz_force_3d from "./examples/lorentz-force-3d.json";
// @ts-ignore
import harmonic_oscillator from "./examples/harmonic-oscillator.json";
// @ts-ignore
import coupled_harmonic_oscillators from "./examples/coupled-harmonic-oscillators.json";
// @ts-ignore
import spring_cart_pendulum from "./examples/spring-cart-pendulum.json";
// @ts-ignore
import duffing_oscillator from "./examples/duffing-oscillator.json";
// @ts-ignore
import van_der_pol_oscillator from "./examples/van-der-pol-oscillator.json";
// @ts-ignore
import pendulum from "./examples/pendulum.json";
// @ts-ignore
import elastic_pendulum_2d from "./examples/elastic-pendulum-2d.json";
// @ts-ignore
import double_pendulum from "./examples/double-pendulum.json";
// @ts-ignore
import pendulums_coupled_by_spring from "./examples/pendulums-coupled-by-spring.json";
// @ts-ignore
import inverted_pendulum_oscillatory_base from "./examples/inverted-pendulum-oscillatory-base.json";
// @ts-ignore
import spherical_pendulum from "./examples/spherical-pendulum.json";
// @ts-ignore
import spherical_pendulum_damping from "./examples/spherical-pendulum-damping.json";
// @ts-ignore
import spherical_elastic_pendulum from "./examples/spherical-elastic-pendulum.json";
// @ts-ignore
import foucault_pendulum from "./examples/foucault-pendulum.json";
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
import random_walk_3d from "./examples/random-walk-3d.json";
// @ts-ignore
import spirals from "./examples/spirals.json";
// @ts-ignore
import regular_polygon from "./examples/regular-polygon.json";
// @ts-ignore
import spider_web from "./examples/spider-web.json";
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
import for_loop from "./examples/for-loop.json";
// @ts-ignore
import while_loop from "./examples/while-loop.json";
// @ts-ignore
import do_while_loop from "./examples/do-while-loop.json";
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
import parametric_equations_2d_1 from "./examples/parametric-equations-2d-1.json";
// @ts-ignore
import parametric_equations_2d_2 from "./examples/parametric-equations-2d-2.json";
// @ts-ignore
import parametric_equations_3d_1 from "./examples/parametric-equations-3d-1.json";
// @ts-ignore
import parametric_equations_3d_2 from "./examples/parametric-equations-3d-2.json";
// @ts-ignore
import parametric_generator_2d_1 from "./examples/parametric-generator-2d-1.json";
// @ts-ignore
import parametric_generator_2d_2 from "./examples/parametric-generator-2d-2.json";

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
    this.files.push({name: "Basics: For Loops", data: for_loop});
    this.files.push({name: "Basics: While Loop", data: while_loop});
    this.files.push({name: "Basics: Do...While Loop", data: do_while_loop});
    this.files.push({name: "Math: Univariate Functions", data: univariate_functions});
    this.files.push({name: "Math: Bundled Functions", data: bundled_functions});
    this.files.push({name: "Math: Bivariate Function 1D Output", data: bivariate_functions});
    this.files.push({name: "Math: Bivariate Function 2D Output", data: himmelblau_function});
    this.files.push({name: "Math: Bivariate Function Contour Plots", data: bivariate_functions_contour_plots});
    this.files.push({name: "Math: Bivariate Function Surface Plots", data: bivariate_functions_surface_plots});
    this.files.push({name: "Math: Contour Plot Settings", data: contour_plot_settings});
    this.files.push({name: "Math: Multivariate Functions", data: multivariate_functions});
    this.files.push({name: "Math: Heart Function", data: heart_function});
    this.files.push({name: "Math: Declared Functions", data: declared_functions});
    this.files.push({name: "Math: 2D Parametric Equations: 1", data: parametric_equations_2d_1});
    this.files.push({name: "Math: 2D Parametric Equations: 2", data: parametric_equations_2d_2});
    this.files.push({name: "Math: 3D Parametric Equations: 1", data: parametric_equations_3d_1});
    this.files.push({name: "Math: 3D Parametric Equations: 2", data: parametric_equations_3d_2});
    this.files.push({name: "Math: 2D Parametric Generator: 1", data: parametric_generator_2d_1});
    this.files.push({name: "Math: 2D Parametric Generator: 2", data: parametric_generator_2d_2});
    this.files.push({name: "Math: Spirals", data: spirals});
    this.files.push({name: "Math: Knots", data: knots});
    this.files.push({name: "Math: Clélie", data: clelia});
    this.files.push({name: "Math: Torus", data: torus});
    this.files.push({name: "Math: Hyperboloid", data: hyperboloid});
    this.files.push({name: "Math: Helicoid", data: helicoid});
    this.files.push({name: "Math: Astroidal Ellipsoid", data: astroidal_ellipsoid});
    this.files.push({name: "Math: Möbius Strip", data: mobius_strip});
    this.files.push({name: "Math: Klein Bottle", data: klein_bottle});
    this.files.push({name: "Math: Bohemian Dome", data: bohemian_dome});
    this.files.push({name: "Math: Plücker's Conoid", data: plucker_conoid});
    this.files.push({name: "Math: Seashell", data: seashell});
    this.files.push({name: "Math: Boy Surface & Roman Surface", data: boy_roman_surfaces});
    this.files.push({name: "Math: Dupin Cyclide", data: dupin_cyclide});
    this.files.push({name: "Math: Breather Surface", data: breather_surface});
    this.files.push({name: "Math: Recurrence Relation", data: duffing_map});
    this.files.push({name: "Math: Regular Polygon", data: regular_polygon});
    this.files.push({name: "Math: Spider Web", data: spider_web});
    this.files.push({name: "Math: Sunflower Pattern", data: sunflower_vogel_model});
    this.files.push({name: "Math: Import Datasets", data: import_datasets});
    this.files.push({name: "Math: Make a Simple Game", data: simple_math_game});
    this.files.push({name: "Sound: Make Sound with Beepers", data: make_sound_with_beepers});
    this.files.push({name: "Sound: Synthesizing Sound", data: synthesizing_sound});
    this.files.push({name: "IoT: RGB LED Array", data: rainbow_hat_rgb_led_array});
    this.files.push({name: "IoT: Blinking LED Lights", data: rainbow_hat_blinking_led_lights});
    this.files.push({name: "IoT: Fading LED Array", data: rainbow_hat_fading_led_array});
    this.files.push({name: "IoT: Sensor Data", data: rainbow_hat_sensor_data});
    this.files.push({name: "IoT: Mixed-Reality Brownian Motion", data: rainbow_hat_brownian_motion});
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
    this.files.push({name: "Optimization: Gradient Descent in One Dimension", data: gradient_descent_1d});
    this.files.push({name: "Optimization: Gradient Descent in Two Dimensions", data: gradient_descent_2d});
    this.files.push({name: "Statistics: Box-Muller Transform", data: box_muller_transform});
    this.files.push({name: "Statistics: Normal Distributions", data: normal_distributions});
    this.files.push({name: "Statistics: Poisson Distribution", data: poisson_distribution});
    this.files.push({name: "Statistics: Random Walk in 2D", data: random_walk});
    this.files.push({name: "Statistics: Random Walk in 3D", data: random_walk_3d});
    this.files.push({name: "Ecology: Logistic Population Model", data: logistic_population_equation});
    this.files.push({name: "Ecology: Predator-Prey Equations", data: predator_prey_equations});
    this.files.push({
      name: "Ecology: Competitive Lotka-Volterra Equations",
      data: competitive_lotka_volterra_equations
    });
    this.files.push({name: "Epidemiology: The SIR Model", data: epidemiology_sir_model});
    this.files.push({name: "Epidemiology: The SEIR Model", data: epidemiology_seir_model});
    this.files.push({name: "Epidemiology: The SIS Model", data: epidemiology_sis_model});
    this.files.push({name: "Epidemiology: The SEIS Model", data: epidemiology_seis_model});
    this.files.push({name: "Chemistry: Irreversible Reaction", data: chemical_kinetics_irreversible_reaction});
    this.files.push({name: "Chemistry: Reversible Reaction", data: chemical_kinetics_reversible_reaction});
    this.files.push({name: "Chemistry: Brusselator", data: brusselator});
    this.files.push({name: "Chemistry: Molecular Visualization", data: molecular_visualization});
    this.files.push({name: "Chemistry: Molecular Structures Formed by Carbon", data: molecular_structure});
    this.files.push({name: "Chemistry: Crystal Structure", data: crystal_structure});
    this.files.push({name: "Chemistry: DNA Molecule", data: dna_molecule});
    this.files.push({name: "Chemistry: Gas Molecules", data: gas_molecules});
    this.files.push({name: "Chemistry: Alloys", data: alloy});
    this.files.push({name: "Chemistry: Nano Gear", data: nano_gear});
    this.files.push({name: "Chemistry: Nano Car", data: nanocar});
    this.files.push({name: "Chemistry: Lennard-Jones Potential", data: lennard_jones_potential});
    this.files.push({name: "Chaos: Logistic Map", data: logistic_map});
    this.files.push({name: "Chaos: Hénon Map", data: henon_map});
    this.files.push({name: "Chaos: Ikeda Map", data: ikeda_map});
    this.files.push({name: "Chaos: Tinkerbell Map", data: tinkerbell_map});
    this.files.push({name: "Chaos: Kaplan–Yorke Map", data: kaplan_yorke_map});
    this.files.push({name: "Chaos: De Jong Map", data: de_jong_map});
    this.files.push({name: "Chaos: Lorenz Attractor", data: lorenz_attractor});
    this.files.push({name: "Chaos: Rössler Attractor", data: rossler_attractor});
    this.files.push({name: "Chaos: Thomas Attractor", data: thomas_attractor});
    this.files.push({name: "Fractals: Fern Generator 1", data: fern_generator_1});
    this.files.push({name: "Fractals: Fern Generator 2", data: fern_generator_2});
    this.files.push({name: "Mechanics: Projectile Motion 1", data: projectile_motion_1});
    this.files.push({name: "Mechanics: Projectile Motion 2", data: projectile_motion_2});
    this.files.push({name: "Mechanics: Trochoid", data: trochoid});
    this.files.push({name: "Mechanics: Hypotrochoid & Epitrochoid", data: hypotrochoid_epitrochoid});
    this.files.push({name: "Mechanics: Scotch Yoke", data: scotch_yoke});
    this.files.push({name: "Mechanics: Inline Slider-Crank Linkage", data: slider_crank_inline});
    this.files.push({name: "Mechanics: Offset Slider-Crank Linkage", data: slider_crank_offset});
    this.files.push({name: "Mechanics: Crank-Rocker Linkage", data: crank_rocker});
    this.files.push({name: "Mechanics: Two-Body Problem in 2D", data: two_body_problem});
    this.files.push({name: "Mechanics: Two-Body Problem in 3D", data: two_body_problem_3d});
    this.files.push({name: "Mechanics: Satellite Orbits", data: satellite_orbits});
    this.files.push({name: "Mechanics: Three-Body Problem", data: three_body_problem});
    this.files.push({name: "Mechanics: Harmonic Oscillator", data: harmonic_oscillator});
    this.files.push({name: "Mechanics: Symplectic Integrator", data: symplectic_integrator});
    this.files.push({name: "Mechanics: Coupled Harmonic Oscillators", data: coupled_harmonic_oscillators});
    this.files.push({name: "Mechanics: Spring-Cart-Pendulum System", data: spring_cart_pendulum});
    this.files.push({name: "Mechanics: Duffing Oscillator", data: duffing_oscillator});
    this.files.push({name: "Mechanics: 2D Simple Pendulum", data: pendulum});
    this.files.push({name: "Mechanics: 2D Elastic Pendulum", data: elastic_pendulum_2d});
    this.files.push({name: "Mechanics: 2D Double Pendulum", data: double_pendulum});
    this.files.push({name: "Mechanics: Pendulums Coupled by Spring", data: pendulums_coupled_by_spring});
    this.files.push({
      name: "Mechanics: 2D Inverted Pendulum on Oscillatory Base",
      data: inverted_pendulum_oscillatory_base
    });
    this.files.push({name: "Mechanics: Metronome", data: metronome});
    this.files.push({name: "Mechanics: Helicopter Retrieval", data: helicopter_retrieval});
    this.files.push({name: "Mechanics: Spherical Pendulum", data: spherical_pendulum});
    this.files.push({name: "Mechanics: Damped Spherical Pendulum", data: spherical_pendulum_damping});
    this.files.push({name: "Mechanics: Spherical Elastic Pendulum", data: spherical_elastic_pendulum});
    this.files.push({name: "Mechanics: Foucault Pendulum", data: foucault_pendulum});
    this.files.push({name: "Electronics: RLC Circuit", data: rlc_circuit});
    this.files.push({name: "Electronics: Chua Circuit", data: chua_circuit});
    this.files.push({name: "Electronics: Van der Pol Oscillator", data: van_der_pol_oscillator});
    this.files.push({name: "Electromagnetism: Lorentz Force in 2D", data: lorentz_force});
    this.files.push({name: "Electromagnetism: Lorentz Force in 3D", data: lorentz_force_3d});
    this.files.push({name: "Biology: Brownian Motion", data: brownian_motion_single_particle});
    this.files.push({name: "Biology: Langevin Equation", data: langevin_equation});
    this.files.push({
      name: "Biology: Brownian Motion with Multiple Particles",
      data: brownian_motion_multiple_particles
    });
    this.files.push({name: "Biology: Hindmarsh–Rose Model of Neuronal Activity", data: hindmarsh_rose_model});
    this.files.push({name: "Signal Processing: Fourier Transform", data: fourier_transform});
    this.files.push({name: "Signal Processing: Convolution Theorem", data: convolution_theorem});
    this.files.push({name: "1D Simulation: Transient State Finite Difference Method", data: pde_fdm_solver});
    this.files.push({name: "1D Simulation: Numerical Stability", data: pde_numerical_stability});
    this.files.push({name: "1D Simulation: Heat Equation", data: heat_equation});
    this.files.push({name: "1D Simulation: Fisher Equation", data: fisher_equation});
    this.files.push({name: "1D Simulation: Wave Equation", data: wave_equation});
    this.files.push({name: "1D Simulation: Transport Equation", data: transport_equation});
    this.files.push({name: "1D Simulation: Standing Waves", data: standing_waves});
    this.files.push({name: "2D Simulation: Steady State Finite Difference Method", data: laplace_equation});
    this.files.push({name: "2D Simulation: Numerical Stabilization", data: fdm_stabilization});
    this.files.push({name: "2D Simulation: Compare Iterative Methods", data: compare_iterative_methods});
    this.files.push({name: "2D Simulation: Poisson Equation", data: poisson_equation});
    this.files.push({name: "2D Simulation: Boundary Value Problems", data: boundary_value_problems});
    this.files.push({name: "2D Simulation: Mixed Boundary Condition", data: mixed_boundary_condition});
    this.files.push({name: "2D Simulation: Convection-Diffusion Equation", data: convection_diffusion_equation});
    this.files.push({name: "2D Simulation: Rayleigh–Bénard Convection", data: rayleigh_benard_convection});

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

    selectElement.onchange = () => {
      if (selectElement.selectedIndex > 0) {
        this.load(this.files[selectElement.selectedIndex - 1].data);
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

  deselect(): void {
    let selectElement = document.getElementById("example-list") as HTMLSelectElement;
    selectElement.selectedIndex = 0;
  }

  loadByTitle(title: string): void {
    for (let f of this.files) {
      if (f.name === title) {
        this.load(f.data);
        break;
      }
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
