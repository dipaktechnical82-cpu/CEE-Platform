'use client';

import { useEffect } from 'react';

/**
 * Patch DOM operations to protect React 19 / Next.js reconciliation from crashes
 * caused by third-party browser extensions (such as Google Translate, Grammarly,
 * or LanguageTool) mutating or wrapping text nodes in <font> elements.
 *
 * Without this guard, `node.parentNode.removeChild(node)` throws:
 * `TypeError: Cannot read properties of null (reading 'removeChild')` or
 * `NotFoundError: Failed to execute 'removeChild' on 'Node'`.
 */
export function DomReconciliationPatch() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof Node === 'undefined' || !Node.prototype) {
      return;
    }

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (!child) return child;

      if (child.parentNode !== this) {
        if (child.parentNode) {
          try {
            return child.parentNode.removeChild(child);
          } catch {
            return child;
          }
        }
        return child;
      }

      try {
        return originalRemoveChild.call(this, child) as T;
      } catch {
        return child;
      }
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (!newNode) return newNode;

      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          try {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode);
          } catch {
            return newNode;
          }
        }
        return newNode;
      }

      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      } catch {
        return newNode;
      }
    };
  }, []);

  return null;
}
