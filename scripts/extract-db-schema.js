#!/usr/bin/env node

/**
 * Database Schema Extraction Script
 * Extracts the current database schema and generates db_schema.md documentation
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function extractDatabaseSchema() {
  try {
    console.log('🔍 Extracting database schema...');
    
    // Get all table information from the database
    const tables = await prisma.$queryRaw`
      SELECT 
        table_name,
        table_type,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    // Get column information for each table
    const columns = await prisma.$queryRaw`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        ordinal_position
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    // Get foreign key relationships
    const foreignKeys = await prisma.$queryRaw`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `;

    // Get indexes
    const indexes = await prisma.$queryRaw`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;

    // Generate markdown documentation
    const markdown = generateMarkdownDocumentation(tables, columns, foreignKeys, indexes);
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'db_schema.md');
    fs.writeFileSync(outputPath, markdown);
    
    console.log('✅ Database schema extracted successfully!');
    console.log(`📄 Schema documentation saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error extracting database schema:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateMarkdownDocumentation(tables, columns, foreignKeys, indexes) {
  const timestamp = new Date().toISOString();
  
  let markdown = `# 🗄️ **Database Schema Documentation**

**Generated**: ${timestamp}  
**Database**: PostgreSQL  
**Schema**: public

---

## 📋 **Overview**

This document contains the current real-time schema of the RetroQuest To-Do application database.

---

## 🏗️ **Tables Structure**

`;

  // Group columns by table
  const tableColumns = {};
  columns.forEach(col => {
    if (!tableColumns[col.table_name]) {
      tableColumns[col.table_name] = [];
    }
    tableColumns[col.table_name].push(col);
  });

  // Group foreign keys by table
  const tableForeignKeys = {};
  foreignKeys.forEach(fk => {
    if (!tableForeignKeys[fk.table_name]) {
      tableForeignKeys[fk.table_name] = [];
    }
    tableForeignKeys[fk.table_name].push(fk);
  });

  // Group indexes by table
  const tableIndexes = {};
  indexes.forEach(idx => {
    if (!tableIndexes[idx.tablename]) {
      tableIndexes[idx.tablename] = [];
    }
    tableIndexes[idx.tablename].push(idx);
  });

  // Generate table documentation
  tables.forEach(table => {
    const tableName = table.table_name;
    const tableCols = tableColumns[tableName] || [];
    const tableFKs = tableForeignKeys[tableName] || [];
    const tableIdxs = tableIndexes[tableName] || [];

    markdown += `### **${tableName}**

**Type**: ${table.table_type}  
**Schema**: ${table.table_schema}

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
`;

    tableCols.forEach(col => {
      const type = formatDataType(col);
      const nullable = col.is_nullable === 'YES' ? '✅' : '❌';
      const defaultValue = col.column_default || '-';
      
      markdown += `| \`${col.column_name}\` | ${type} | ${nullable} | ${defaultValue} | - |\n`;
    });

    if (tableFKs.length > 0) {
      markdown += `\n#### **Foreign Keys**\n\n`;
      tableFKs.forEach(fk => {
        markdown += `- \`${fk.column_name}\` → \`${fk.foreign_table_name}.${fk.foreign_column_name}\`\n`;
      });
    }

    if (tableIdxs.length > 0) {
      markdown += `\n#### **Indexes**\n\n`;
      tableIdxs.forEach(idx => {
        markdown += `- \`${idx.indexname}\`: ${idx.indexdef}\n`;
      });
    }

    markdown += `\n---\n\n`;
  });

  // Add relationships section
  markdown += `## 🔗 **Table Relationships**

`;

  const relationships = new Map();
  foreignKeys.forEach(fk => {
    const key = `${fk.table_name} → ${fk.foreign_table_name}`;
    if (!relationships.has(key)) {
      relationships.set(key, []);
    }
    relationships.get(key).push(`${fk.column_name} → ${fk.foreign_column_name}`);
  });

  relationships.forEach((relations, key) => {
    const [fromTable, toTable] = key.split(' → ');
    markdown += `### **${fromTable} → ${toTable}**\n\n`;
    relations.forEach(relation => {
      markdown += `- ${relation}\n`;
    });
    markdown += `\n`;
  });

  // Add summary
  markdown += `## 📊 **Summary**

- **Total Tables**: ${tables.length}
- **Total Columns**: ${columns.length}
- **Total Foreign Keys**: ${foreignKeys.length}
- **Total Indexes**: ${indexes.length}

---

**Note**: This schema is extracted from the live database and reflects the current state at the time of generation.

`;

  return markdown;
}

function formatDataType(column) {
  let type = column.data_type;
  
  if (column.character_maximum_length) {
    type += `(${column.character_maximum_length})`;
  } else if (column.numeric_precision) {
    type += `(${column.numeric_precision}`;
    if (column.numeric_scale) {
      type += `,${column.numeric_scale}`;
    }
    type += ')';
  }
  
  return `\`${type}\``;
}

// Run the extraction
extractDatabaseSchema()
  .then(() => {
    console.log('🎉 Database schema extraction completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database schema extraction failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });
