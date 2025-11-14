import React from 'react'

interface SummaryTabProps {
  documentId: string;
}

export function SummaryTab({ documentId }: SummaryTabProps) {

  return (
    <div className="p-6 h-full overflow-y-auto text-sm">
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          This document summarizes key differences between Java interfaces
          and abstract classes, crucial concepts for object-oriented
          programming and interview preparation.
        </p>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base">
            1. Java Interfaces
          </h3>
          <p className="mb-2">
            <strong>Definition:</strong> A blueprint for a class, defining
            abstract and static methods. Since Java 8, interfaces can
            also have default methods.
          </p>
          <p className="mb-2">
            <strong>Method Characteristics:</strong> By default, methods
            are <strong>public</strong> and <strong>abstract</strong>.
            Variables are <strong>public</strong>, <strong>static</strong>,
            and <strong>final</strong>.
          </p>
          <p>
            <strong>Implementation:</strong> A class implementing an interface
            must provide implementations for all abstract methods.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-base">
            2. Abstract Classes
          </h3>
          <p className="mb-2">
            <strong>Definition:</strong> Can contain both abstract (methods
            without implementation) and concrete (implemented) methods.
          </p>
          <p>
            <strong>Inheritance:</strong> A class can extend only one
            abstract class.
          </p>
        </div>
      </div>
    </div>
  )
}