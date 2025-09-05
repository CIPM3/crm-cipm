// === DATA UTILITY FUNCTIONS ===
// Functions to interact with mock data (replace with API calls in production)

import {
  students,
  courses,
  modules,
  enrollments,
  tasks,
  customers,
  deals,
  users
} from "./mock-data"

// Student utilities
export function getStudentById(id: string) {
  return students.find((student) => student.id === id)
}

// Course utilities
export function getCourseById(id: string) {
  return courses.find((course) => course.id === id)
}

export function getCourses() {
  return courses
}

// Module utilities
export function getModuleById(id: string) {
  return modules.find((module) => module.id === id)
}

export function getModulesByCourseId(courseId: string) {
  return modules.filter((module) => module.courseId === courseId).sort((a, b) => a.order - b.order)
}

// Enrollment utilities
export function getEnrollmentById(id: string) {
  return enrollments.find((enrollment) => enrollment.id === id)
}

export function getEnrollmentsByStudentId(studentId: string) {
  return enrollments.filter((enrollment) => enrollment.studentId === studentId)
}

export function getEnrollmentsByCourseId(courseId: string) {
  return enrollments.filter((enrollment) => enrollment.courseId === courseId)
}

// Task utilities
export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id)
}

export function getTasksByRelatedId(type: string, id: string) {
  return tasks.filter((task) => task.relatedTo.type === type && task.relatedTo.id === id)
}

// User utilities
export function getUserById(id: string) {
  return users.find((user) => user.id === id)
}

// Customer utilities
export function getCustomerById(id: string) {
  return customers.find((customer) => customer.id === id)
}

// Deal utilities
export function getDealById(id: string) {
  return deals.find((deal) => deal.id === id)
}

export function getDealsByCustomerId(customerId: string) {
  return deals.filter((deal) => deal.customerId === customerId)
}